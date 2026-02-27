import { afterAll, afterEach, beforeEach, describe, test } from 'bun:test';
import esbuild from 'esbuild';
import path from 'node:path';
import tailwindPlugin from '../source/index';
import { basicCssFixture } from './fixtures/basicCss';
import { cssModulesFixture } from './fixtures/cssModules';
import { cssModulesExcludeFixture } from './fixtures/cssModulesExclude';
import { cssModulesOptionsFixture } from './fixtures/cssModulesOptions';
import { disableAutoprefixerFixture } from './fixtures/disableAutoprefixer';
import {
	cleanupAllTestEnvironments,
	cleanupTestEnvironment,
	setupTestEnvironment,
} from './utils/environment';
import type { Fixture } from './utils/types';

const fixtures: Fixture[] = [
	basicCssFixture,
	disableAutoprefixerFixture,
	cssModulesFixture,
	cssModulesOptionsFixture,
	cssModulesExcludeFixture,
];

afterAll(() => {
	cleanupAllTestEnvironments();
});

for (const fixture of fixtures) {
	describe(fixture.description, () => {
		let testDir: string;
		let outdir: string;

		beforeEach(() => {
			const testId = Bun.hash(fixture.description).toString(16);
			({ testDir, outdir } = setupTestEnvironment(testId, fixture.files));
		});

		afterEach(() => {
			cleanupTestEnvironment(testDir);
		});

		test('should work correctly', async () => {
			const result = await esbuild.build({
				entryPoints: [path.join(testDir, fixture.entrypoint)],
				outdir,
				bundle: true,
				write: true,
				logLevel: 'silent',
				plugins: [tailwindPlugin(fixture.pluginOptions)],
			});

			await fixture.assert(result, outdir);
		});
	});
}
