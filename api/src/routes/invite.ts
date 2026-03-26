import { auth, user } from '@blocklet/sdk/lib/middlewares';
import { randomInt } from 'crypto';
import { Router } from 'express';
import Joi from 'joi';
import { pick } from 'lodash';
import { customAlphabet } from 'nanoid';
import { InferAttributes, Op, WhereOptions } from 'sequelize';

import { authService } from '../libs/auth';
import { componentIds } from '../libs/constants';
import { config } from '../libs/env';
import getHoroscope, { getHoroscopeData } from '../libs/horoscope';
import { parseLanguage } from '../libs/language';
import logger from '../libs/logger';
import { ensureAdmin } from '../libs/security';
import Invite from '../store/models/invite';
import InviteFriend from '../store/models/invite-friend';
import User from '../store/models/user';
import { generateReport } from './report';

const router = Router();

const generateInputSchema = Joi.object<{ count: number; public?: boolean; usedCount: number }>({
  count: Joi.number().integer().min(1).max(1000).required(),
  public: Joi.boolean().default(false),
  usedCount: Joi.number().integer().min(0).default(0).max(Joi.ref('count')),
});

const generateInviteCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10);

router.post('/generate', ensureAdmin, async (req, res) => {
  const { count, usedCount, ...input } = await generateInputSchema.validateAsync(req.body, { stripUnknown: true });

  const codes = new Array(count).fill(0).map(() => generateInviteCode());

  const usedIndexes = new Set<number>();
  while (usedIndexes.size < Math.min(usedCount, count)) {
    usedIndexes.add(randomInt(0, count));
  }

  const list = await Invite.bulkCreate(
    codes.map((code, index) => ({
      code,
      public: input.public,
      userId: usedIndexes.has(index) ? 'used' : undefined,
    })),
  );

  res.json({
    list,
  });
});

const paginationSchema = Joi.object<{
  page: number;
  size: number;
  used?: boolean;
  public?: boolean;
}>({
  page: Joi.number().integer().min(1).default(1),
  size: Joi.number().integer().min(1).max(1000).default(100),
  used: Joi.boolean().empty(''),
  public: Joi.boolean().empty(''),
});

router.get('/', ensureAdmin, async (req, res) => {
  const { page, size, ...query } = await paginationSchema.validateAsync(req.query, { stripUnknown: true });

  const where: WhereOptions<InferAttributes<Invite>> = {};

  if (typeof query.used === 'boolean') {
    where.userId = query.used ? { [Op.not]: null } : { [Op.is]: null };
  }
  if (typeof query.public === 'boolean') {
    where.public = query.public;
  }

  const { rows: list, count } = await Invite.findAndCountAll({
    where,
    order: [['id', 'DESC']],
    offset: (page - 1) * size,
    limit: size,
  });

  res.json({ count, list });
});

const patchInviteSchema = Joi.object<{ note?: string }>({
  note: Joi.string().allow('', null).max(200),
});

router.patch('/:inviteId', ensureAdmin, async (req, res) => {
  const { inviteId } = req.params;
  if (!inviteId) throw new Error('Missing required params `inviteId`');

  const input = await patchInviteSchema.validateAsync(req.body, { stripUnknown: true });

  const invite = await Invite.findByPk(inviteId, { rejectOnEmpty: new Error('Invite not found') });
  await invite.update({ ...input });

  res.json(invite.dataValues);
});

router.get('/public/codes', async (_, res) => {
  const list = await Invite.findAll({
    where: { public: true },
    order: [['id', 'DESC']],
    limit: config.limitation.publicInviteCodeNumber,
  });

  res.json({ list: list.map((i) => ({ ...pick(i, 'code'), used: !!i.userId })) });
});

router.get('/friend-invite', auth(), user(), async (req, res) => {
  const { did: toUserId } = req.user!;
  if (!toUserId) throw new Error('Missing required params `id`');
  const friends = await InviteFriend.findAll({
    where: {
      toUserId,
    },
  });
  const inviteFriends = await Promise.all(
    friends
      .filter((f) => !!f.fromUserId)
      .map(async (f) => {
        const fromUser = await authService.getUser(f.fromUserId);
        const user = await User.findByPk(f.fromUserId, { rejectOnEmpty: new Error('User not found') });
        return {
          ...f.dataValues,
          friendName: fromUser.user?.fullName,
          friendBirthDate: user.birthDate,
          friendBirthPlace: user.birthPlace,
        };
      }),
  );
  return res.json({ code: 200, inviteFriends });
});

router.get('/friend-invite/:id', user(), async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error('Missing required params `id`');
  const inviteFriend = await InviteFriend.findByPk(id, { rejectOnEmpty: new Error('Invite not found') });
  if (
    inviteFriend?.toUserId &&
    inviteFriend?.toUserId !== req.user?.did &&
    inviteFriend?.fromUserId !== req.user?.did
  ) {
    return res.json({ code: 403, error: 'Forbidden' });
  }
  const fromUser = await authService.getUser(inviteFriend?.fromUserId!);
  return res.json({
    code: 200,
    status: inviteFriend?.status,
    inviteFriend: { ...inviteFriend.dataValues, fromUserName: fromUser.user?.fullName },
  });
});

router.get('/friend-invite/report-id/:id', user(), async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error('Missing required params `id`');
  const inviteFriend = await InviteFriend.findOne({
    where: {
      reportId: id,
    },
  });
  // If bind toUser, only allow to access toUser and fromUser
  if (
    inviteFriend?.toUserId &&
    inviteFriend?.toUserId !== req.user?.did &&
    inviteFriend?.fromUserId !== req.user?.did
  ) {
    return res.json({ code: 403, error: 'Forbidden' });
  }
  return res.json({ code: 200, status: inviteFriend?.status, inviteFriend });
});

router.delete('/friend-invite/:id', user(), auth(), async (req, res) => {
  const { id } = req.params;
  const { did: userId } = req.user!;
  if (!id) throw new Error('Missing required params `id`');
  const inviteFriend = await InviteFriend.findByPk(id, { rejectOnEmpty: new Error('Invite not found') });
  if (inviteFriend.fromUserId === userId) {
    await inviteFriend.update({ fromUserId: '' });
    return res.json({ code: 200 });
  }
  if (inviteFriend.toUserId === userId) {
    await inviteFriend.update({ toUserId: '' });
    return res.json({ code: 200 });
  }
  return res.json({ code: 500, message: 'no permission' });
});

router.post('/friend-invite', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;
  const { friendName } = req.body;
  const inviteFriend = await InviteFriend.create({
    fromUserId: userId,
    friendName,
    status: 'pending',
  });
  return res.json({ code: 200, inviteFriend });
});

const friendInviteBodySchema = Joi.object<{
  friendBirthDate: string;
  friendBirthPlace: {
    longitude: number;
    latitude: number;
    address: string;
  };
  toUserId: string;
  fromUserId: string;
  lang?: string;
}>({
  toUserId: Joi.string(),
  fromUserId: Joi.string(),
  friendBirthDate: Joi.string(),
  friendBirthPlace: Joi.object({
    longitude: Joi.number().min(-180).max(180),
    latitude: Joi.number().min(-90).max(90),
    address: Joi.string(),
  }),
  lang: Joi.string().empty(['', null]),
});

router.post('/friend-invite/complete/:id', async (req, res) => {
  const body = await friendInviteBodySchema.validateAsync(req.body, { stripUnknown: true });
  const { friendBirthDate, friendBirthPlace, toUserId, fromUserId, lang } = body;
  const { id } = req.params;
  if (!id) throw new Error('Missing required params `id`');
  if (friendBirthPlace.latitude === 0 && friendBirthPlace.longitude === 0) {
    throw new Error('params `friendBirthPlace` in wrong validation');
  }

  const fromUser = await User.findByPk(fromUserId);

  // Generate report now if inviter has birth info; otherwise defer to view time
  let reportId: string;
  if (fromUser?.birthDate && fromUser?.birthPlace && friendBirthDate && friendBirthPlace) {
    const { report } = await generateReport({
      userId: fromUserId,
      language: parseLanguage(lang),
      type: 'synastry' as const,
      user: {
        birthDate: fromUser.birthDate,
        birthPlace: fromUser.birthPlace,
        horoscope: getHoroscopeData(getHoroscope({ birthDate: fromUser.birthDate, birthPlace: fromUser.birthPlace })),
      },
      secondaryUser: {
        birthDate: friendBirthDate,
        birthPlace: friendBirthPlace,
        horoscope: getHoroscopeData(getHoroscope({ birthDate: friendBirthDate, birthPlace: friendBirthPlace })),
      },
      inviteId: id,
    });
    reportId = report.id;
  } else {
    // Defer report creation — GET /report/:reportId will create it on first view
    reportId = `synastry-invite-${id}`;
  }

  await InviteFriend.update(
    {
      friendBirthDate,
      friendBirthPlace,
      toUserId,
      status: 'completed',
      reportId,
    },
    { where: { id } },
  );

  // Points reward for inviter
  try {
    const actionForInviter = config.points.actions.synastryInviter;
    if (actionForInviter) {
      const { call } = await import('@blocklet/sdk/lib/component');
      await call({
        name: componentIds.pointUp,
        path: '/api/add-point-cc',
        method: 'POST',
        data: {
          ruleId: actionForInviter.ruleId,
          userDID: fromUserId,
        },
      });
    }
  } catch (error) {
    logger.error('failed to add point when bind success', error);
  }
  return res.json({ data: 200, reportId });
});

router.post('/friend-invite/finished/:id', user(), auth(), async (req, res) => {
  const { utcOffset } = req.body;
  const { did: toUserId } = req.user!;
  const { id } = req.params;
  if (!id) throw new Error('Missing required params `id`');
  const inviteFriend = await InviteFriend.findByPk(id, { rejectOnEmpty: new Error('Invite not found') });
  if (inviteFriend.toUserId) {
    return res.json({ code: 500, message: 'already linked' });
  }
  if (inviteFriend.fromUserId === toUserId) {
    return res.json({ code: 500, message: 'cannot invite yourself' });
  }
  await InviteFriend.update(
    {
      toUserId,
      status: 'linked',
    },
    { where: { id } },
  );

  // Points reward for invitee
  try {
    const actionForInvitee = config.points.actions.synastryInvitee;
    if (actionForInvitee) {
      const { call } = await import('@blocklet/sdk/lib/component');
      await call({
        name: componentIds.pointUp,
        path: '/api/add-point-cc',
        method: 'POST',
        data: {
          ruleId: actionForInvitee.ruleId,
          userDID: toUserId,
        },
      });
    }
  } catch (error) {
    logger.error('failed to add point when bind success', error);
  }

  const [userRecord] = await User.findOrCreate({ where: { id: toUserId } });

  if (!userRecord.birthDate && !userRecord.birthPlace) {
    await userRecord.updateUserInfo({
      birthDate: inviteFriend?.friendBirthDate || '',
      birthPlace: inviteFriend!.friendBirthPlace!,
      horoscope: getHoroscopeData(
        getHoroscope({ birthDate: inviteFriend?.friendBirthDate!, birthPlace: inviteFriend!.friendBirthPlace! }),
      ),
      utcOffset,
    });
  }
  return res.json({ data: 200 });
});

export default router;
