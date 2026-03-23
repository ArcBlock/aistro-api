import { MessageType } from '../../../store/models/message';
import User from '../../../store/models/user';
import { getTranslation } from '../translations';
import { ChatHandle } from '../types';

export const handleRequestCompleteProfile: ChatHandle<MessageType.RequestCompleteProfile> = async ({ ...args }) => {
  return {
    type: MessageType.RequestCompleteProfile,
    data: await getTranslation('noBirthInfo', args.language),
    input: { type: 'datetime', chatInputType: MessageType.UpdateBirthDate },
  };
};

export const handleUpdateBirthDate: ChatHandle<MessageType.UpdateBirthDate> = async ({ userId, input, ...args }) => {
  if (userId) {
    await User.findByPk(userId, { rejectOnEmpty: new Error('User not found') }).then((u) =>
      u.update({ birthDate: input.birthDate }),
    );
  }
  return {
    type: MessageType.UpdateBirthDate,
    data: await getTranslation('requestBirthPlace', args.language),
    input: {
      type: 'location',
      chatInputType: MessageType.UpdateBirthPlace,
      next: { birthDate: input.birthDate },
    },
  };
};

export const handleUpdateBirthPlace: ChatHandle<MessageType.UpdateBirthPlace> = async ({ userId, input, ...args }) => {
  if (userId) {
    await User.findByPk(userId, { rejectOnEmpty: new Error('User not found') }).then((u) =>
      u.update({ birthDate: input.birthDate, birthPlace: input.birthPlace }),
    );
  }

  return {
    type: MessageType.UpdateBirthPlace,
    data: await getTranslation('reportGenerating', args.language),
    next: { type: MessageType.NatalReport, birthDate: input.birthDate, birthPlace: input.birthPlace },
  };
};
