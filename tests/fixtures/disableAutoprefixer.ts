import { expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Glob } from 'bun';
import type { Fixture } from '../utils/types';

export const disableAutoprefixerFixture: Fixture = {
	description: 'disables autoprefixer when configured',
	pluginOptions: {
		postcssPlugins: {
			disableAutoprefixer: true,
		},
	},
	files: {
		'index.js': 'import "./style.css";',
		'style.css': [
			'.flex { display: flex; }',
			'.backdrop { backdrop-filter: blur(10px); }',
		].join('\n'),
	},
	entrypoint: 'index.js',
	assert: async (_result, outdir) => {
		const glob = new Glob('*.css');
		const cssFiles = Array.from(glob.scanSync(outdir));
		expect(cssFiles).toHaveLength(1);

		const css = readFileSync(join(outdir, cssFiles[0]), 'utf8');
		expect(css).not.toContain('-webkit-backdrop-filter');
	},
};
