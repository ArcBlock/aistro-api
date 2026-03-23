/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'vite-plugin-blocklet';

declare module 'express-history-api-fallback';

declare module 'express-async-errors';

declare module 'lunarphase-calculator';

declare module '@arcblock/*';

namespace Express {
  interface Request {
    user?: {
      did: string;
      role: string | undefined;
      fullName: string;
      provider: string;
      walletOS: string;
    };
    file?: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    };
  }
}

declare module 'circular-natal-horoscope-js/dist' {
  export { Horoscope, Origin } from 'circular-natal-horoscope-js';
}

interface ArrayConstructor {
  isArray(arg: ReadonlyArray<any> | any): arg is ReadonlyArray<any>;
}

declare module '@blocklet/logger';

declare module 'node-apple-receipt-verify';

declare module 'mime-types';

declare module 'multer' {
  import { Request, RequestHandler } from 'express';

  interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  }

  interface StorageEngine {
    _handleFile(req: Request, file: File, cb: (error: Error | null, info?: Partial<File>) => void): void;
    _removeFile(req: Request, file: File, cb: (error: Error | null) => void): void;
  }

  interface DiskStorageOptions {
    destination?: string | ((req: Request, file: File, cb: (error: Error | null, destination: string) => void) => void);
    filename?: (req: Request, file: File, cb: (error: Error | null, filename: string) => void) => void;
  }

  interface Multer {
    single(fieldname: string): RequestHandler;
    array(fieldname: string, maxCount?: number): RequestHandler;
    fields(fields: Array<{ name: string; maxCount?: number }>): RequestHandler;
    none(): RequestHandler;
    any(): RequestHandler;
  }

  interface MulterStatic {
    (options?: any): Multer;
    diskStorage(options: DiskStorageOptions): StorageEngine;
    memoryStorage(): StorageEngine;
  }

  const multer: MulterStatic;
  export = multer;
}
