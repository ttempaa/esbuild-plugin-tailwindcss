import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const baseDir = path.resolve(import.meta.dirname, '..', 'test-fixtures');

export const setupTestEnvironment = (
	testId: string,
	files: Record<string, string>,
) => {
	const testDir = path.join(baseDir, `test-${testId}`);
	const outdir = path.join(testDir, 'out');

	mkdirSync(outdir, { recursive: true });

	for (const [filePath, content] of Object.entries(files)) {
		const fullPath = path.join(testDir, filePath);
		mkdirSync(path.dirname(fullPath), { recursive: true });
		writeFileSync(fullPath, content);
	}

	return { testDir, outdir };
};

export const cleanupTestEnvironment = (testDir: string) => {
	rmSync(testDir, { recursive: true, force: true });
};

export const cleanupAllTestEnvironments = () => {
	rmSync(baseDir, { recursive: true, force: true });
};
