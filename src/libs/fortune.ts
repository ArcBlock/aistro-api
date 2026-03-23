import axios from './api';

export async function getFortuneReport(id: string): Promise<any> {
  return axios.get(`/api/fortune/report/${id}`).then((res) => res.data);
}
