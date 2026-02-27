import { expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Glob } from 'bun';
import type { Fixture } from '../utils/types';

export const basicCssFixture: Fixture = {
	description: 'processes basic CSS with TailwindCSS',
	pluginOptions: {},
	files: {
		'index.js': 'import "./style.css";',
		'style.css': [
			'@import "tailwindcss";',
			'.btn { @apply px-4 py-2; }',
		].join('\n'),
	},
	entrypoint: 'index.js',
	assert: async (_result, outdir) => {
		const glob = new Glob('*.css');
		const cssFiles = Array.from(glob.scanSync(outdir));
		expect(cssFiles).toHaveLength(1);

		const css = readFileSync(join(outdir, cssFiles[0]), 'utf8');
		expect(css).toContain('padding');
	},
};
