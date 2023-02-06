import { AcceptedPlugin as PostcssPlugin } from 'postcss';

export interface TailwindPluginOptions {
	configPath: string;
	postcssPlugins: PostcssPlugin[];
	cssModulesEnabled: boolean;
	cssModulesFilter: RegExp;
	cssModulesExcludePaths: RegExp[];
}
