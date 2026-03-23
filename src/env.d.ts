declare var blocklet: { prefix: string } | undefined;

declare module '*.svg';
declare module '*.svg?react' {
  const component: React.FC<React.SVGProps<SVGSVGElement>>;
  export default component;
}
declare module 'dsbridge';
declare module 'react-render-image';
declare module 'react-scroll-to-bottom';
declare module 'numbro';
