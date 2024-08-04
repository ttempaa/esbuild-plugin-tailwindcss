import { Plugin } from 'esbuild';
import { TailwindPluginOptions } from './types.js';
import { getSetup } from './setup.js';

const defaultOptions: TailwindPluginOptions = {
	configPath: undefined,
	postcssPlugins: [],
	cssModulesEnabled: false,
	cssModulesExcludePaths: [],
	cssModulesFilter: /\.module\.css$/i,
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
