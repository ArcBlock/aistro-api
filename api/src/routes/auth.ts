import { Router } from 'express';
import Joi from 'joi';

import { authService, generateAuthServiceRefreshToken, verifyRefreshToken } from '../libs/auth';
import logger from '../libs/logger';

const router = Router();

export interface AuthInput {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface ThirdAuthInput extends AuthInput {
  idToken: string;
}

const refreshTokenBodySchema = Joi.object<{ refreshToken: string }>({
  refreshToken: Joi.string().max(500).required(),
});

router.post('/refreshToken', async (req, res) => {
  const input = await refreshTokenBodySchema.validateAsync(req.body, { stripUnknown: true });

  let result: Awaited<ReturnType<typeof authService.refreshSession>>;

  try {
    result = await authService.refreshSession(input);
  } catch (error) {
    // 为了从自定义 token 平滑过渡到 auth service 的 token
    logger.warn('refresh session error, fallback to verify by aistro self', error);
    const { did } = verifyRefreshToken(input.refreshToken);
    const refreshToken = generateAuthServiceRefreshToken({ did });
    result = await authService.refreshSession({ refreshToken });
  }

  res.json({
    accessToken: result.token,
    refreshToken: result.refreshToken,
    expiresIn: 0, // 为了兼容客户端，暂时不能把这个字段去掉
    tokenType: 'Bearer', // 为了兼容客户端，暂时不能把这个字段去掉
  });
});

export default router;
