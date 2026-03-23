import { MessageType } from '../../../store/models/message';
import { getTranslation } from '../translations';
import { ChatHandle } from '../types';

export const handleAppInit: ChatHandle<MessageType.AppInit> = async ({ ...args }) => {
  return {
    type: MessageType.AppInit,
    data: await getTranslation('welcome0', args.language),
  };
};

export const handleDailyInit: ChatHandle<MessageType.DailyInit> = async ({ ...args }) => {
  return {
    type: MessageType.DailyInit,
    data: await getTranslation('dailyInit', args.language),
  };
};
