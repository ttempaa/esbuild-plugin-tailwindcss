import path from 'path';
import { Plugin } from 'esbuild';
import { TailwindPluginOptions } from './types.js';
import { getSetup } from './setup.js';

const dirname: string = process.cwd();

const defaultOptions: TailwindPluginOptions = {
	configPath: path.resolve(dirname, 'tailwind.config.js'),
	postcssPlugins: [],
};

const tailwindPlugin = (options: Partial<TailwindPluginOptions> = {}): Plugin => {
	options = Object.assign(defaultOptions, options);
	return {
		name: 'tailwindcss',
		setup: getSetup(options as TailwindPluginOptions),
	};
};

export { tailwindPlugin };
export default tailwindPlugin;
