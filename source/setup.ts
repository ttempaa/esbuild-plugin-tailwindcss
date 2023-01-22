import { PluginBuild } from 'esbuild';
import fs from 'fs/promises';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

export const getSetup = (configPath: string) => async (build: PluginBuild) => {
	build.onLoad({ filter: /\.css$/ }, async (args) => {
		let source = await fs.readFile(args.path, 'utf8');
		let { default: tailwindConfig } = await import(configPath);
		let { css } = postcss([tailwindcss(tailwindConfig), autoprefixer]).process(source, {
			from: void 0,
		});
		return {
			contents: css,
			loader: 'css',
		};
	});
};
