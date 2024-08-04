import type { Plugin } from 'esbuild';
import { getSetup } from './setup.js';
import type { TailwindPluginOptions } from './types.js';

const defaultOptions: TailwindPluginOptions = {
	configPath: undefined,
	postcssPlugins: [],
	cssModulesEnabled: false,
	cssModulesExcludePaths: [],
	cssModulesFilter: /\.module\.css$/i,
};

const tailwindPlugin = (
	options: Partial<TailwindPluginOptions> = {},
): Plugin => {
	return {
		name: 'tailwindcss',
		setup: getSetup({
			...defaultOptions,
			...options,
		} as TailwindPluginOptions),
	};
};

export { tailwindPlugin };
export default tailwindPlugin;
