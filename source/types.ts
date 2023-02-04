import { Plugin } from 'postcss';

export interface TailwindPluginOptions {
	configPath: string;
	postcssPlugins: Plugin[];
}
