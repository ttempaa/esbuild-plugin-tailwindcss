import path from 'path';
import { Plugin } from 'esbuild';
import { TailwindPluginOptions } from './types.js';
import { getSetup } from './setup.js';

const dirname: string = process.cwd();

const tailwindPlugin = ({
	configPath = path.resolve(dirname, 'tailwind.config.js'),
}: TailwindPluginOptions = {}): Plugin => {
	return {
		name: 'tailwindcss',
		setup: getSetup(configPath),
	};
};

export { tailwindPlugin };
export default tailwindPlugin;
