import type { Plugin } from 'esbuild';
import { getSetup } from './setup.js';
import type { TailwindPluginOptions } from './types.js';

const tailwindPlugin = (options: TailwindPluginOptions = {}): Plugin => ({
	name: 'tailwindcss',
	setup: getSetup(options),
});

export { tailwindPlugin };
export default tailwindPlugin;
