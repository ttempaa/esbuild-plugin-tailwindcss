import type { BuildResult } from 'esbuild';
import type { TailwindPluginOptions } from '../../source/types';

export interface Fixture {
	description: string;
	pluginOptions: TailwindPluginOptions;
	files: Record<string, string>;
	entrypoint: string;
	assert: (result: BuildResult, outdir: string) => void | Promise<void>;
}
