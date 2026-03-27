import type { ConfigFile } from '../../api/src/libs/env';
import axios from './api';

export async function getSettings(): Promise<ConfigFile> {
  return axios.get('/api/setting/system').then((res) => res.data);
}

export async function setSettings(setting: ConfigFile): Promise<ConfigFile> {
  return axios.post('/api/setting/system', setting).then((res) => res.data);
}

export async function generateBlog(): Promise<{ message: string }> {
  return axios.post('/api/setting/generate-blog').then((res) => res.data);
}
