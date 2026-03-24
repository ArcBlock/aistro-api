import AuthStorage from '@arcblock/did-auth-storage-nedb';
import { AuthService } from '@blocklet/sdk';
import { deriveWallet, getWallet } from '@blocklet/sdk/lib/wallet';
import { WalletAuthenticator } from '@blocklet/sdk/lib/wallet-authenticator';
import { WalletHandlers as WalletHandler } from '@blocklet/sdk/lib/wallet-handler';
import Client from '@ocap/client';
import { Hasher } from '@ocap/mcrypto';
import { OAuth2Client } from 'google-auth-library';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import path from 'path';
import verifyToken from 'verify-apple-id-token';

import env, { config } from './env';

export const authService = new AuthService();

let _wallet: ReturnType<typeof getWallet>;
export function getAppWallet() {
  if (!_wallet) {
    _wallet = getWallet();
  }
  return _wallet;
}
/** @deprecated use getAppWallet() instead */
export const wallet = new Proxy({} as ReturnType<typeof getWallet>, {
  get(_, prop) {
    return (getAppWallet() as any)[prop];
  },
});
let _client: InstanceType<typeof Client>;
export function getClient() {
  if (!_client) {
    _client = new Client(env.chainHost);
  }
  return _client;
}
/** @deprecated use getClient() instead */
export const client = new Proxy({} as InstanceType<typeof Client>, {
  get(_, prop) {
    return (getClient() as any)[prop];
  },
});

export const authenticator = new WalletAuthenticator();
export const handlers = new WalletHandler({
  authenticator,
  tokenStorage: new AuthStorage({
    dbPath: path.join(env.dataDir, 'auth.db'),
  }),
});

let _secret: string;
function getSecret() {
  if (!_secret) {
    const w = getAppWallet();
    if (w.secretKey) {
      _secret = Hasher.SHA3.hash256!(
        Buffer.concat([w.secretKey, w.address].map((v) => Buffer.from(v)) as Uint8Array[]),
      ) as string;
    } else {
      // Remote signing mode: secretKey not available, use address + dataDir as secret base
      _secret = Hasher.SHA3.hash256!(Buffer.from(`${w.address}:${env.dataDir}`)) as string;
    }
  }
  return _secret;
}

export function generateAuthServiceRefreshToken({ did }: { did: string }) {
  return sign({ type: 'user', tokenType: 'refresh', role: 'guest', passport: {}, did }, getSecret(), {
    subject: did,
    expiresIn: 3600,
  });
}

export function verifyRefreshToken(refreshToken: string) {
  const { sub: did, type } = verify(refreshToken, getSecret()) as JwtPayload;
  if (type !== 'refreshToken') {
    throw new Error('Invalid refresh token type');
  }
  if (typeof did !== 'string') {
    throw new Error(`Invalid did ${did}`);
  }

  return { did };
}

export async function getGoogleUserInfo(idToken: string) {
  const client = new OAuth2Client(config.auth.google.clientId);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: config.auth.google.clientId,
  });
  const response = ticket.getPayload();
  if (!response) throw new Error('Failed to verify google idToken');

  return {
    name: response.name || response.given_name || response.email || response.sub,
    email: response.email,
    avatar: response.picture,
    id: response.sub,
  };
}

export class HttpError extends Error {
  constructor(
    message?: string,
    public status?: number,
  ) {
    super(message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized', status: number = 401) {
    super(message, status);
  }
}

export async function getAppleUserInfo(idToken: string) {
  const response = await verifyToken({
    idToken,
    clientId: config.auth.apple.clientId,
  });

  return {
    name: undefined,
    email: response.email,
    avatar: undefined,
    id: response.sub,
  };
}

export async function generateUserDid(id: string) {
  const userWallet = await deriveWallet(id);
  return userWallet.address;
}
