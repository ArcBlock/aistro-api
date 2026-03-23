import { omit, sample } from 'lodash';
import { Op } from 'sequelize';

import { authService, generateUserDid, getAppleUserInfo, getGoogleUserInfo } from '../../../libs/auth';
import { config } from '../../../libs/env';
import Message, { MessageType } from '../../../store/models/message';
import User from '../../../store/models/user';
import { getTranslation } from '../translations';
import { ChatHandle, MessageActionType, TEST_GOOGLE_ID_TOKEN } from '../types';

export const handleLogin: ChatHandle<MessageType.Login> = async ({ stream, userId, input, ...args }) => {
  const { googleIdToken, appleIdToken } = input as any;
  if (!googleIdToken && !appleIdToken) {
    throw new Error('Missing required one of `googleIdToken` and `appleIdToken` parameter');
  }

  const thirdUser = googleIdToken
    ? googleIdToken === TEST_GOOGLE_ID_TOKEN
      ? { avatar: undefined, email: 'test@arcblock.io', name: undefined, id: TEST_GOOGLE_ID_TOKEN }
      : await getGoogleUserInfo(googleIdToken)
    : await getAppleUserInfo(appleIdToken);

  const avatar = thirdUser.avatar || sample(config.avatars.pool);

  const username =
    thirdUser.name || thirdUser.email?.split('@')[0] || `User-${Math.random().toString(36).slice(2, 10)}`;
  const id = `${googleIdToken ? 'google-oauth2' : 'apple'}|${thirdUser.id}`;
  const did = await generateUserDid(id);

  const {
    token: accessToken,
    refreshToken,
    ...authResult
  } = await authService.login({
    provider: 'auth0',
    avatar,
    email: thirdUser.email || `${did}@abtnetwork.io`,
    fullName: username,
    id,
    updateInfo: false,
  });

  const walletUser = authResult.user as { did: string; avatar?: string };

  const [user, created] = await User.findOrCreate({ where: { id: walletUser.did } });

  const needAlertBirthInfo = !!user.birthDate && !!input.birthDate;

  await user.updateUserInfo({
    birthDate: input.birthDate,
    birthPlace: input.birthPlace,
    horoscope: input.horoscope,
    utcOffset: input.utcOffset,
  });

  if (input.natalReportMessageId) {
    await Message.update(
      { userId: user.id },
      { where: { id: input.natalReportMessageId, userId: { [Op.is]: null as any } } },
    );
  }

  return {
    type: MessageType.Login,
    data: needAlertBirthInfo
      ? `${await getTranslation('welcomeBackInformationTip', args.language)}\n${await getTranslation(
          'welcomeBackInformationTipBirthDate',
          args.language,
        )} ${user.birthDate}\n${await getTranslation('welcomeBackInformationTipBirthPlace', args.language)} ${
          user.birthPlace?.address || ''
        }`
      : !created
        ? await getTranslation('welcomeBack', args.language)
        : await getTranslation('welcomeLogin', args.language),
    context: {
      userId: user.id,
      ...omit(await User.getUserDetail(user.id), 'id'),
      accessToken,
      refreshToken,
      expiresIn: 0, // for client compatibility
      tokenType: 'Bearer', // for client compatibility
    },
    actions: needAlertBirthInfo
      ? [
          {
            action: 'message',
            type: user.birthDate && user.birthPlace ? MessageActionType.EditProfile : MessageActionType.CompleteProfile,
            params: { type: MessageType.RequestCompleteProfile },
          },
        ]
      : undefined,
  };
};
