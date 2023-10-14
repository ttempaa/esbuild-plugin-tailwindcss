import autoprefixer from 'autoprefixer';
import { OnLoadArgs, OnLoadResult, OnResolveArgs, OnResolveResult, PluginBuild } from 'esbuild';
import fs from 'fs/promises';
import path from 'path';
import postcss, { AcceptedPlugin as PostcssPlugin } from 'postcss';
import PostcssModulesPlugin from 'postcss-modules';
import tailwindcss from 'tailwindcss';
import { getHash } from './functions/getHash';
import { loadConfig } from './functions/loadConfig';
import { TailwindPluginOptions } from './types';

export const getSetup =
	({
		configPath,
		postcssPlugins: postcssUserPlugins,
		cssModulesEnabled,
		cssModulesFilter,
		cssModulesExcludePaths,
	}: TailwindPluginOptions) =>
	async (build: PluginBuild) => {
		let cache: Map<string, string | object> = new Map();
		let namespace: string = 'tailwind-css-module';
		let tailwindConfig = await loadConfig(configPath);
		let onLoadCSS = async (args: OnLoadArgs): Promise<OnLoadResult> => {
			let fileName: string = path.basename(args.path);
			let isCssModule: boolean = cssModulesEnabled && cssModulesFilter.test(fileName);
			let postcssPlugins: PostcssPlugin[] = [
				tailwindcss(tailwindConfig),
				autoprefixer,
				...postcssUserPlugins,
			];
			if (isCssModule) {
				postcssPlugins.push(
					PostcssModulesPlugin({
						globalModulePaths: cssModulesExcludePaths,
						getJSON: (_, classes) => cache.set(args.path, classes),
					})
				);
			}
			let source = await fs.readFile(args.path, 'utf8');
			let { css } = await postcss(postcssPlugins).process(source, {
				from: args.path,
			});
			if (!isCssModule) return { contents: css, loader: 'css' };
			let importHash: string = getHash(args.path);
			let importPath: string = `${namespace}://${importHash}`;
			let classes: string = JSON.stringify(cache.get(args.path));
			let contents: string = `import "${importPath}"; export default ${classes};`;
			cache.set(importPath, css);
			return { contents, loader: 'js' };
		};
		let onLoadCSSModule = (args: OnLoadArgs): OnLoadResult => ({
			contents: cache.get(args.path)?.toString(),
			loader: 'css',
		});
		let onResolveCSSModule = (args: OnResolveArgs): OnResolveResult => ({
			path: args.path,
			namespace,
		});
		build.onLoad({ filter: /\.css$/ }, onLoadCSS);
		build.onLoad({ filter: /.*/, namespace }, onLoadCSSModule);
		build.onResolve({ filter: new RegExp(`^${namespace}://`) }, onResolveCSSModule);
	};
