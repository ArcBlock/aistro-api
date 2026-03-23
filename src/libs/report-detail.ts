import axios from './api';
import { ReportDetail } from './type';

export async function getReportDetail(reportId: string, language: string): Promise<ReportDetail> {
  return axios.get(`/api/report/details/${reportId}`, { params: { language } }).then((res) => res.data);
}
