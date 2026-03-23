import Report from './models/report';
import ReportDetail from './models/report-detail';

export async function resetGeneratingStatus() {
  await Promise.all([
    ReportDetail.update({ generateStatus: 'error' }, { where: { generateStatus: 'generating' } }),
    Report.update({ generateStatus: 'error' }, { where: { generateStatus: 'generating' } }),
  ]);
}
