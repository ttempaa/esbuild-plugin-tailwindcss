import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['source/index.ts'],
	format: ['esm', 'cjs'],
	minify: true,
	splitting: true,
	sourcemap: false,
	clean: true,
	dts: true,
});
