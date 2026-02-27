import { expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Glob } from 'bun';
import type { Fixture } from '../utils/types';

export const cssModulesExcludeFixture: Fixture = {
	description: 'excludes files from CSS modules processing',
	pluginOptions: {
		cssModules: {
			enabled: true,
			exclude: [/global\.module\.css$/],
		},
	},
	files: {
		'index.js': [
			'import styles from "./component.module.css";',
			'import "./global.module.css";',
			'console.log(styles);',
		].join('\n'),
		'component.module.css': '.scoped { color: red; }',
		'global.module.css': '.global { color: blue; }',
	},
	entrypoint: 'index.js',
	assert: async (_result, outdir) => {
		const cssGlob = new Glob('*.css');
		const cssFiles = Array.from(cssGlob.scanSync(outdir));
		expect(cssFiles.length).toBeGreaterThanOrEqual(1);

		// The global file should keep its original class name unchanged
		const allCss = cssFiles
			.map((f) => readFileSync(join(outdir, f), 'utf8'))
			.join('\n');
		expect(allCss).toContain('.global');
	},
};
