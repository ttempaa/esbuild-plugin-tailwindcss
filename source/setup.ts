import fs from 'node:fs/promises';
import path from 'node:path';
import autoprefixer from 'autoprefixer';
import type {
	OnLoadArgs,
	OnLoadResult,
	OnResolveArgs,
	OnResolveResult,
	PluginBuild,
} from 'esbuild';
import postcss, { type AcceptedPlugin as PostcssPlugin } from 'postcss';
import PostcssModulesPlugin from 'postcss-modules';
import tailwindcss from 'tailwindcss';
import { getHash } from './functions/getHash';
import type { PostcssPluginConfig, TailwindPluginOptions } from './types';

export const getSetup =
	({
		configPath,
		postcssPlugins: postcssUserPlugins,
		cssModulesEnabled,
		cssModulesFilter,
		cssModulesExcludePaths,
	}: TailwindPluginOptions) =>
	async (build: PluginBuild) => {
		const cache: Map<string, string | object> = new Map();
		const namespace = 'tailwind-css-module';
		const onLoadCSS = async (args: OnLoadArgs): Promise<OnLoadResult> => {
			const fileName: string = path.basename(args.path);
			const isCssModule: boolean =
				cssModulesEnabled && cssModulesFilter.test(fileName);

			const pluginsToPrepend: PostcssPlugin[] = [];
			const pluginsToAppend: PostcssPlugin[] = [];
			for (const plugin of postcssUserPlugins) {
				const isConfig =
					typeof plugin === 'object' && (plugin as PostcssPluginConfig).plugin;
				if (isConfig) {
					const config = plugin as PostcssPluginConfig;
					if (config.prepend) {
						pluginsToPrepend.push(config.plugin);
					} else {
						pluginsToAppend.push(config.plugin);
					}
				} else {
					pluginsToAppend.push(plugin as PostcssPlugin);
				}
			}

			const postcssPlugins: PostcssPlugin[] = [
				...pluginsToPrepend,
				tailwindcss(configPath),
				autoprefixer,
				...pluginsToAppend,
			];
			if (isCssModule) {
				postcssPlugins.push(
					PostcssModulesPlugin({
						globalModulePaths: cssModulesExcludePaths,
						getJSON: (_, classes) => cache.set(args.path, classes),
					}),
				);
			}
			const source = await fs.readFile(args.path, 'utf8');
			const { css } = await postcss(postcssPlugins).process(source, {
				from: args.path,
			});
			if (!isCssModule) return { contents: css, loader: 'css' };
			const importHash: string = getHash(args.path);
			const importPath = `${namespace}://${importHash}`;
			const classes: string = JSON.stringify(cache.get(args.path));
			const contents = `import "${importPath}"; export default ${classes};`;
			cache.set(importPath, css);
			return { contents, loader: 'js' };
		};
		const onLoadCSSModule = (args: OnLoadArgs): OnLoadResult => ({
			contents: cache.get(args.path)?.toString(),
			loader: 'css',
		});
		const onResolveCSSModule = (args: OnResolveArgs): OnResolveResult => ({
			path: args.path,
			namespace,
		});
		build.onLoad({ filter: /\.css$/ }, onLoadCSS);
		build.onLoad({ filter: /.*/, namespace }, onLoadCSSModule);
		build.onResolve(
			{ filter: new RegExp(`^${namespace}://`) },
			onResolveCSSModule,
		);
	};
