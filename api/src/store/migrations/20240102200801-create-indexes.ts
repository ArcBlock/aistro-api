import type { Migration } from '../migrate';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addIndex('Billings', ['userId']);
  await queryInterface.addIndex('Billings', ['platform']);
  await queryInterface.addIndex('Billings', ['expirationDate']);
  await queryInterface.addIndex('Billings', ['purchaseTargetId']);

  await queryInterface.addIndex('BuiltinAnswers', ['originalAnswerId']);
  await queryInterface.addIndex('BuiltinAnswers', ['key']);
  await queryInterface.addIndex('BuiltinAnswers', ['language']);

  await queryInterface.addIndex('Feedbacks', ['userId']);
  await queryInterface.addIndex('Feedbacks', ['key']);
  await queryInterface.addIndex('Feedbacks', ['action']);
  await queryInterface.addIndex('Feedbacks', ['sectionId']);

  await queryInterface.addIndex('Fortunes', ['userId']);
  await queryInterface.addIndex('Fortunes', ['status']);
  await queryInterface.addIndex('Fortunes', ['type']);

  await queryInterface.addIndex('InviteFriends', ['fromUserId']);
  await queryInterface.addIndex('InviteFriends', ['toUserId']);
  await queryInterface.addIndex('InviteFriends', ['reportId']);

  await queryInterface.addIndex('Invites', ['userId']);

  await queryInterface.addIndex('LuckyDraw', ['userId']);
  await queryInterface.addIndex('LuckyDraw', ['medalId']);

  await queryInterface.addIndex('Medals', ['userId']);
  await queryInterface.addIndex('Medals', ['reason']);

  await queryInterface.addIndex('Messages', ['userId']);
  await queryInterface.addIndex('Messages', ['type']);

  await queryInterface.addIndex('PredictTopics', ['topic']);
  await queryInterface.addIndex('PredictTopics', ['language']);

  await queryInterface.addIndex('ReportDetails', ['reportId']);
  await queryInterface.addIndex('ReportDetails', ['userId']);
  await queryInterface.addIndex('ReportDetails', ['generateStatus']);
  await queryInterface.addIndex('ReportDetails', ['feedbackStatus']);

  await queryInterface.addIndex('Reports', ['userId']);
  await queryInterface.addIndex('Reports', ['type']);
  await queryInterface.addIndex('Reports', ['key']);
  await queryInterface.addIndex('Reports', ['generateStatus']);

  await queryInterface.addIndex('SNSEndpoints', ['userId']);

  await queryInterface.addIndex('SNSHistories', ['target']);

  await queryInterface.addIndex('SNSSubscriptions', ['userId']);

  await queryInterface.addIndex('SNSTopics', ['name']);
  await queryInterface.addIndex('SNSTopics', ['type']);
  await queryInterface.addIndex('SNSTopics', ['language']);
  await queryInterface.addIndex('SNSTopics', ['utcOffset']);
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeIndex('Billings', ['userId']);
  await queryInterface.removeIndex('Billings', ['platform']);
  await queryInterface.removeIndex('Billings', ['expirationDate']);
  await queryInterface.removeIndex('Billings', ['purchaseTargetId']);

  await queryInterface.removeIndex('BuiltinAnswers', ['originalAnswerId']);
  await queryInterface.removeIndex('BuiltinAnswers', ['key']);
  await queryInterface.removeIndex('BuiltinAnswers', ['language']);

  await queryInterface.removeIndex('Feedbacks', ['userId']);
  await queryInterface.removeIndex('Feedbacks', ['key']);
  await queryInterface.removeIndex('Feedbacks', ['action']);
  await queryInterface.removeIndex('Feedbacks', ['sectionId']);

  await queryInterface.removeIndex('Fortunes', ['userId']);
  await queryInterface.removeIndex('Fortunes', ['status']);
  await queryInterface.removeIndex('Fortunes', ['type']);

  await queryInterface.removeIndex('InviteFriends', ['fromUserId']);
  await queryInterface.removeIndex('InviteFriends', ['toUserId']);
  await queryInterface.removeIndex('InviteFriends', ['reportId']);

  await queryInterface.removeIndex('Invites', ['userId']);

  await queryInterface.removeIndex('LuckyDraw', ['userId']);
  await queryInterface.removeIndex('LuckyDraw', ['medalId']);

  await queryInterface.removeIndex('Medals', ['userId']);
  await queryInterface.removeIndex('Medals', ['reason']);

  await queryInterface.removeIndex('Messages', ['userId']);
  await queryInterface.removeIndex('Messages', ['type']);

  await queryInterface.removeIndex('PredictTopics', ['topic']);
  await queryInterface.removeIndex('PredictTopics', ['language']);

  await queryInterface.removeIndex('ReportDetails', ['reportId']);
  await queryInterface.removeIndex('ReportDetails', ['userId']);
  await queryInterface.removeIndex('ReportDetails', ['generateStatus']);
  await queryInterface.removeIndex('ReportDetails', ['feedbackStatus']);

  await queryInterface.removeIndex('Reports', ['userId']);
  await queryInterface.removeIndex('Reports', ['type']);
  await queryInterface.removeIndex('Reports', ['key']);
  await queryInterface.removeIndex('Reports', ['generateStatus']);

  await queryInterface.removeIndex('SNSEndpoints', ['userId']);

  await queryInterface.removeIndex('SNSHistories', ['target']);

  await queryInterface.removeIndex('SNSSubscriptions', ['userId']);

  await queryInterface.removeIndex('SNSTopics', ['name']);
  await queryInterface.removeIndex('SNSTopics', ['type']);
  await queryInterface.removeIndex('SNSTopics', ['language']);
  await queryInterface.removeIndex('SNSTopics', ['utcOffset']);
};
