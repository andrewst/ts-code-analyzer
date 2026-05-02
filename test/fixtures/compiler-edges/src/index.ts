import { join } from 'node:path';

export * from './helper.js';
export * as tools from './helper.js';
export * from './missing.js';

const localValue = join('a', 'b');

export { localValue };
