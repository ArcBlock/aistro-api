import { createAxios, createFetch } from '@blocklet/js-sdk';
import { AxiosResponse } from 'axios';
import { joinURL } from 'ufo';

import { DataProps, InviteFriend } from './type';

const BASE_URL = import.meta.env.VITE_API_URL || joinURL(window.location.origin, window.blocklet?.prefix || '/');

const axios = createAxios({});

export const fetch = createFetch();

export const getErrorMessage = (error: any) =>
  error.response?.data?.error?.message || error.response?.data?.message || error.message || error;

export default axios;

export async function getMessage({
  messageId,
  language,
}: {
  messageId: string;
  language?: string;
}): Promise<AxiosResponse<DataProps>> {
  return axios.get(`/api/report/${messageId}`, { params: { language } });
}

export function getContentUrl({ messageId }: { messageId: string }): string {
  return joinURL(BASE_URL, `/api/message/${messageId}/content`);
}

export function bindInviteFriend({
  userId,
  invitedId,
  utcOffset,
}: {
  userId: string;
  invitedId: string;
  utcOffset: number;
}): Promise<AxiosResponse> {
  return axios.post(`/api/invites/friend-invite/finished/${invitedId}`, { toUserId: userId, utcOffset });
}

export function getInviteFriend({
  reportId,
}: {
  reportId: string;
}): Promise<AxiosResponse<{ code: number; inviteFriend: InviteFriend }>> {
  return axios.get(`/api/invites/friend-invite/report-id/${reportId}`);
}

export function getUserInfo(): Promise<
  AxiosResponse<{ birthDate: string; birthPlace: { longitude: number; latitude: number; address: string } }>
> {
  return axios.get('/api/user');
}
