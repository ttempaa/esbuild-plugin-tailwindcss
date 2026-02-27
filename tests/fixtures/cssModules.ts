import { expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Glob } from 'bun';
import type { Fixture } from '../utils/types';

export const cssModulesFixture: Fixture = {
	description: 'processes CSS modules and exports class names',
	pluginOptions: {
		cssModules: {
			enabled: true,
		},
	},
	files: {
		'index.js': 'import styles from "./button.module.css"; console.log(styles);',
		'button.module.css': '.button { color: red; }',
	},
	entrypoint: 'index.js',
	assert: async (_result, outdir) => {
		const glob = new Glob('*.js');
		const jsFiles = Array.from(glob.scanSync(outdir));
		expect(jsFiles).toHaveLength(1);

		const js = readFileSync(join(outdir, jsFiles[0]), 'utf8');
		// JS output should contain the exported class mapping
		expect(js).toContain('button');

		// CSS output should exist
		const cssGlob = new Glob('*.css');
		const cssFiles = Array.from(cssGlob.scanSync(outdir));
		expect(cssFiles.length).toBeGreaterThanOrEqual(1);
	},
};
