import 'animate.css';
import ReactDOM from 'react-dom/client';

import App from './app';

const SUPPRESSED_WARNINGS = ['Support for defaultProps will be removed'];
const { error } = console;
console.error = (msg, ...args: any[]) => {
  if (typeof msg === 'string' && !SUPPRESSED_WARNINGS.some((entry) => msg.includes(entry))) {
    error(msg, ...args);
  }
};

if (window.location.href.includes('lang=')) {
  window.location.replace(window.location.href.replace('lang=', 'locale='));
}

const root = ReactDOM.createRoot(document.getElementById('app')!);
root.render(<App />);
