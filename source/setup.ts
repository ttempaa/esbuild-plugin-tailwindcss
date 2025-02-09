import fs from 'node:fs/promises';
import path from 'node:path';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import type {
	OnLoadArgs,
	OnLoadResult,
	OnResolveArgs,
	OnResolveResult,
	PluginBuild,
} from 'esbuild';
import postcss, { type AcceptedPlugin as PostcssPlugin } from 'postcss';
import postcssModulesPlugin from 'postcss-modules';
import { getHash } from './functions/getHash';
import type { TailwindPluginOptions } from './types';

export const getSetup =
	(options: TailwindPluginOptions) => (build: PluginBuild) => {
		const {
			postcssPlugins: userPostcssPlugins = {},
			cssModules: {
				enabled: cssModulesEnabled = false,
				filter: cssModulesFilter = /\.module\.css$/,
				exclude: cssModulesExclude = [],
			} = {},
		} = options;
		const namespace = 'tailwindcss-module';
		const cache: Map<string, string | object> = new Map();

		// Handles loading and processing of CSS files
		const onLoadCSS = async (args: OnLoadArgs): Promise<OnLoadResult> => {
			const fileName = path.basename(args.path);
			const isCssModule = cssModulesEnabled && cssModulesFilter.test(fileName);
			const postcssPlugins: PostcssPlugin[] = [
				...(userPostcssPlugins?.prepend || []),
				tailwindcss(),
				autoprefixer(),
				...(userPostcssPlugins?.append || []),
			];

			if (isCssModule) {
				postcssPlugins.push(
					postcssModulesPlugin({
						globalModulePaths: cssModulesExclude,
						getJSON: (_, classes) => cache.set(args.path, classes),
					}),
				);
			}

			const source = await fs.readFile(args.path, 'utf8');
			const { css } = await postcss(postcssPlugins).process(source, {
				from: args.path,
			});

			// If it's not a CSS module, return the raw CSS
			if (!isCssModule) {
				return { contents: css, loader: 'css' };
			}

			// For CSS modules, generate a virtual import and export the class names
			const importPath = `${namespace}://${getHash(args.path)}`;
			const classes = JSON.stringify(cache.get(args.path));
			const contents = `import "${importPath}"; export default ${classes};`;
			cache.set(importPath, css);

			return { contents, loader: 'js' };
		};

		// Handles loading of cached CSS for virtual imports
		const onLoadCSSModule = (args: OnLoadArgs): OnLoadResult => ({
			contents: cache.get(args.path)?.toString(),
			loader: 'css',
		});

		// Resolves virtual import paths to the namespace
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
