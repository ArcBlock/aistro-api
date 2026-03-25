/* eslint-disable no-console */
import { rimrafSync } from 'rimraf';

console.log('clean .blocklet folder');
rimrafSync('.blocklet');
rimrafSync('prompts');
console.log('clean .blocklet folder done!');
