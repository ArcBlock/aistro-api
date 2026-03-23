import Invite from '../../api/src/store/models/invite';
import User from '../../api/src/store/models/user';
import axios from './api';
import { InviteFriend } from './type';

export async function getInvites(
  query: {
    page?: number;
    size?: number;
    public?: boolean;
    used?: boolean;
  } = {},
): Promise<{ count: number; list: Invite[] }> {
  return axios.get('/api/invites', { params: query }).then((res) => res.data);
}

export async function generateInvites(input: { count: number; public?: boolean }): Promise<void> {
  return axios.post('/api/invites/generate', input);
}

export async function updateInvite(inviteId: string, input: { note?: string | null }): Promise<Invite> {
  return axios.patch(`/api/invites/${inviteId}`, input).then((res) => res.data);
}

export async function generatePublicInvites(): Promise<{ list: { code: string; used: boolean }[] }> {
  return axios.get('/api/invites/public/codes').then((res) => res.data);
}

export async function getInvitation(id: string): Promise<{ code: number; inviteFriend: InviteFriend }> {
  return axios.get(`/api/invites/friend-invite/${id}`).then((res) => res.data);
}

export async function completeInvitation(
  id: string,
  fromUserId: string,
  friendBirthDate: string,
  friendBirthPlace: { longitude: number; latitude: number; address: string },
  lang?: string,
): Promise<{ code: number; reportId: string }> {
  return axios
    .post(`/api/invites/friend-invite/complete/${id}`, { friendBirthDate, friendBirthPlace, fromUserId, lang })
    .then((res) => res.data);
}

export async function getUserDetail(): Promise<User> {
  return axios.get('/api/user').then((res) => res.data);
}
