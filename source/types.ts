import { AcceptedPlugin as PostcssPlugin } from 'postcss';

export interface PostcssPluginConfig {
	plugin: PostcssPlugin;
	prepend?: boolean;
}

export interface TailwindPluginOptions {
	configPath: string;
	postcssPlugins: (PostcssPlugin | PostcssPluginConfig)[];
	cssModulesEnabled: boolean;
	cssModulesFilter: RegExp;
	cssModulesExcludePaths: RegExp[];
}
