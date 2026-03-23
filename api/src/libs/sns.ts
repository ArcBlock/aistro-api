/**
 * SNS (AWS Simple Notification Service) stub module.
 *
 * The real implementation depends on @aws-sdk/client-sns and has significant
 * AWS infrastructure wiring. This stub provides the same API surface so that
 * the SNS route compiles, but every function is a no-op that logs a warning.
 *
 * TODO: port the real implementation from the old project when push
 * notifications are needed in the new aistro-ai blocklet.
 */
import logger from './logger';

export enum NotificationType {
  DailyLuckyNFT,
}

export async function createOrUpdatePlatformEndpoint({
  platform,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  token,
  userId,
}: {
  platform: 'ios' | 'ios-sandbox' | 'android';
  token: string;
  userId: string;
}): Promise<string> {
  logger.warn('[sns stub] createOrUpdatePlatformEndpoint called — returning placeholder', {
    platform,
    userId,
  });
  return `stub-endpoint-${platform}-${userId}`;
}

export async function deletePlatformEndpoint({ endpointArn }: { endpointArn: string }) {
  logger.warn('[sns stub] deletePlatformEndpoint called — no-op', { endpointArn });
}

export async function createTopic({ name }: { name: string }): Promise<string> {
  logger.warn('[sns stub] createTopic called — returning placeholder', { name });
  return `stub-topic-arn-${name}`;
}

export async function subscribeTopic({ topicArn, endpoint }: { topicArn: string; endpoint: string }): Promise<string> {
  logger.warn('[sns stub] subscribeTopic called — returning placeholder', { topicArn, endpoint });
  return 'stub-subscription-arn';
}

export async function unsubscribeTopic({ subscriptionArn }: { subscriptionArn: string }) {
  logger.warn('[sns stub] unsubscribeTopic called — no-op', { subscriptionArn });
}

export async function sendNotification({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  reason,
  topicArn,
  targetArn,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  message,
}: {
  reason?: string;
  topicArn?: string;
  targetArn?: string;
  message: { APNS?: object; GCM?: object; default?: string };
}) {
  logger.warn('[sns stub] sendNotification called — no-op', {
    topicArn,
    targetArn,
  });
}

export async function sendPredictTopicNotification(params: {
  targetArn?: string;
  reportId: string;
  reportDetailId: string;
  userId: string;
  language: string;
  date: string;
  topic: string;
  report?: string;
}) {
  logger.warn('[sns stub] sendPredictTopicNotification called — no-op', {
    userId: params.userId,
    topic: params.topic,
  });
}
