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
  }
}

declare module 'circular-natal-horoscope-js/dist' {
  export { Horoscope, Origin } from 'circular-natal-horoscope-js';
}

interface ArrayConstructor {
  isArray(arg: ReadonlyArray<any> | any): arg is ReadonlyArray<any>;
}

declare module '@blocklet/logger';
