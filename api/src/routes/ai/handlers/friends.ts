import { UnauthorizedError } from '../../../libs/auth';
import Message, { MessageRole, MessageType } from '../../../store/models/message';
import User from '../../../store/models/user';
import { getTranslation } from '../translations';
import { ChatHandle } from '../types';
import { handleRequestCompleteProfile } from './profile';

export const handleRequestAddFriendProfile: ChatHandle<MessageType.RequestAddFriendProfile> = async ({
  userId,
  ...args
}) => {
  if (!userId) {
    throw new UnauthorizedError();
  }

  return {
    type: MessageType.RequestAddFriendProfile,
    data: await getTranslation('requestSynastryUserName', args.language),
    input: { type: 'string', chatInputType: MessageType.UpdateFriendName },
  };
};

export const handleUpdateFriendName: ChatHandle<MessageType.UpdateFriendName> = async ({ userId, ...args }) => {
  if (!userId) {
    throw new UnauthorizedError();
  }

  return {
    type: MessageType.UpdateFriendName,
    data: await getTranslation('requestSynastryBirthDate', args.language),
    input: { type: 'datetime', chatInputType: MessageType.UpdateFriendBirthDate },
  };
};

export const handleUpdateFriendBirthDate: ChatHandle<MessageType.UpdateFriendBirthDate> = async ({
  userId,
  ...args
}) => {
  if (!userId) {
    throw new UnauthorizedError();
  }

  return {
    type: MessageType.UpdateFriendBirthDate,
    data: await getTranslation('requestSynastryBirthPlace', args.language),
    input: { type: 'location', chatInputType: MessageType.UpdateFriendBirthPlace },
  };
};

export const handleUpdateFriendBirthPlace: ChatHandle<MessageType.UpdateFriendBirthPlace> = async ({
  userId,
  input,
  ...args
}) => {
  if (!userId) throw new UnauthorizedError();

  const user = await User.findByPk(userId, { rejectOnEmpty: new Error('User not found') });
  const { birthDate, birthPlace } = user;
  if (!birthDate || !birthPlace) {
    return handleRequestCompleteProfile({ input, ...args } as any);
  }

  const friendName = (
    (
      await Message.findOne({
        where: { userId, role: MessageRole.user, type: MessageType.UpdateFriendName },
        order: [['id', 'DESC']],
        limit: 1,
      })
    )?.parameters as any
  )?.name;

  const friendBirthDate = (
    (
      await Message.findOne({
        where: { userId, role: MessageRole.user, type: MessageType.UpdateFriendBirthDate },
        order: [['id', 'DESC']],
        limit: 1,
      })
    )?.parameters as any
  )?.birthDate;

  if (!friendName || !friendBirthDate) {
    return handleRequestAddFriendProfile({ ...args, userId, input: {} } as any);
  }

  return {
    type: MessageType.UpdateFriendBirthPlace,
    data: await getTranslation('reportGenerating', args.language),
    next: {
      type: MessageType.SynastryReport,
      birthDate,
      birthPlace,
      friend: {
        name: friendName,
        birthDate: friendBirthDate,
        birthPlace: input.birthPlace,
      },
    },
  };
};
