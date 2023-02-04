import { OnLoadArgs, OnLoadResult, PluginBuild } from 'esbuild';
import fs from 'fs/promises';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { TailwindPluginOptions } from './types';

export const getSetup =
	({ configPath, postcssPlugins }: TailwindPluginOptions) =>
	async (build: PluginBuild) => {
		let onLoadCSS = async (args: OnLoadArgs): Promise<OnLoadResult> => {
			let source = await fs.readFile(args.path, 'utf8');
			let { default: tailwindConfig } = await import(configPath);
			let { css } = postcss([
				tailwindcss(tailwindConfig),
				autoprefixer,
				...postcssPlugins,
			]).process(source, {
				from: void 0,
			});
			return {
				contents: css,
				loader: 'css',
			};
		};
		build.onLoad({ filter: /\.css$/ }, onLoadCSS);
	};
