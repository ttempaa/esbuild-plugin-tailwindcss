import type { AcceptedPlugin as PostcssPlugin } from 'postcss';

export interface TailwindPluginOptions {
	/**
	 * Custom PostCSS plugins to prepend or append to the default plugin chain.
	 */
	postcssPlugins?: {
		/** Plugins to add before Tailwind and Autoprefixer. */
		prepend?: PostcssPlugin[];
		/** Plugins to add after Tailwind and Autoprefixer. */
		append?: PostcssPlugin[];
		/** Disable applying the Autoprefixer plugin. Defaults to `false`. */
		disableAutoprefixer?: boolean;
	};

	/**
	 * CSS Modules configuration.
	 */
	cssModules?: {
		/** Enable CSS Modules. Defaults to `true`. */
		enabled?: boolean;
		/** Regex to identify CSS Module files. Defaults to `/\.module\.css$/`. */
		filter?: RegExp;
		/** Regex patterns to exclude files from CSS Modules. */
		exclude?: RegExp[];
	};
}
