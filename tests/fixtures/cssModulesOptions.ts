import { expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Glob } from 'bun';
import type { Fixture } from '../utils/types';

export const cssModulesOptionsFixture: Fixture = {
	description: 'passes options to postcss-modules (localsConvention)',
	pluginOptions: {
		cssModules: {
			enabled: true,
			options: {
				localsConvention: 'camelCaseOnly',
			},
		},
	},
	files: {
		'index.js':
			'import styles from "./component.module.css"; console.log(styles);',
		'component.module.css': '.my-class { color: blue; }',
	},
	entrypoint: 'index.js',
	assert: async (_result, outdir) => {
		const glob = new Glob('*.js');
		const jsFiles = Array.from(glob.scanSync(outdir));
		expect(jsFiles).toHaveLength(1);

		const js = readFileSync(join(outdir, jsFiles[0]), 'utf8');
		// With camelCaseOnly, "my-class" should become "myClass"
		expect(js).toContain('myClass');
		// The original dashed name should NOT be present as a key
		expect(js).not.toContain('"my-class"');
	},
};
