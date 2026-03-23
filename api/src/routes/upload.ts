import { getComponentMountPoint, getComponentWebEndpoint } from '@blocklet/sdk/lib/component';
import { auth } from '@blocklet/sdk/lib/middlewares';
import { sign } from '@blocklet/sdk/lib/util/verify-sign';
import axios from 'axios';
import { Router } from 'express';
import { rmSync } from 'fs';
import { pickBy } from 'lodash';
import mime from 'mime-types';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { join } from 'path';
import { joinURL } from 'ufo';

import env from '../libs/env';

const router = Router();

const generateFilename = () => `${Date.now()}-${nanoid()}`;

const upload = multer({
  storage: multer.diskStorage({
    destination: join(env.dataDir, 'upload'),
    filename: (_, file, cb) => {
      cb(null, `${generateFilename()}.${mime.extension(file.mimetype)}`);
    },
  }),
});

router.post('/', auth(), upload.single('file'), async (req, res) => {
  const { file } = req;
  if (!file) {
    throw new Error('Missing required file');
  }

  try {
    const data = {
      type: 'path',
      filename: file.originalname,
      data: file.path,
    };

    const sig = await sign(data);
    const { data: image } = await axios({
      url: '/api/sdk/uploads',
      baseURL: getComponentWebEndpoint('image-bin'),
      method: 'POST',
      headers: {
        'x-component-sig': sig,
        'x-component-did': process.env.BLOCKLET_COMPONENT_DID,
        ...pickBy(req.headers, (_, k) => k.startsWith('x-user-')),
      },
      data,
    });

    const url = new URL(env.appUrl);
    const mountPoint = getComponentMountPoint('image-bin');
    url.pathname = joinURL(mountPoint || '/', '/uploads', image.filename);

    res.json({ url });
  } finally {
    rmSync(file.path, { recursive: true, force: true });
  }
});

export default router;
