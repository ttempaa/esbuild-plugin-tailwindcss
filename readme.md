# esbuild-plugin-tailwindcss

Just a [esbuild](https://esbuild.github.io/) plugin to simplify the connection of [TailwindCSS](https://tailwindcss.com).

[![npm](https://img.shields.io/npm/v/esbuild-plugin-tailwindcss.svg)](https://www.npmjs.com/package/esbuild-plugin-tailwindcss)
[![npm](https://img.shields.io/npm/dt/esbuild-plugin-tailwindcss.svg)](https://www.npmjs.com/package/esbuild-plugin-tailwindcss)
[![npm](https://img.shields.io/npm/l/esbuild-plugin-tailwindcss.svg)](https://www.npmjs.com/package/esbuild-plugin-tailwindcss)

> [!NOTE]
> This version (2.x) works with TailwindCSS v4. If you need TailwindCSS v3, use the 1.x version of this plugin.

## Install

| Package manager | Command                                  |
| --------------- | ---------------------------------------- |
| npm             | `npm i -D esbuild-plugin-tailwindcss`    |
| yarn            | `yarn add -D esbuild-plugin-tailwindcss` |
| bun             | `bun add -d esbuild-plugin-tailwindcss`  |

## Basic usage

> This module can be imported as ESM or CJS. The examples below use the ESM syntax.

Add plugin in build config:

```js
import esbuild from "esbuild";
import tailwindPlugin from "esbuild-plugin-tailwindcss";

esbuild.build({
  entryPoints: ["src/index.js"],
  outdir: "dist",
  bundle: true,
  plugins: [
    tailwindPlugin({
      /* options */
    }),
  ],
});
```

Add the `@import "tailwindcss"` import to your main CSS file.

```css
/* index.css */
@import "tailwindcss";
```

Import `index.css` from your main `js`, `jsx`, `ts`, `tsx` file:

```js
/* index.js */
import "./index.css";
```

Done, you can use the TailwindCSS in the project!

## Options

| Name                                 | Type              | Default            | Description                                                                                                                                                          |
| ------------------------------------ | ----------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `postcssPlugins.prepend`             | `PostcssPlugin[]` | `[]`               | Adds custom PostCSS plugins **before** TailwindCSS processing.                                                                                                       |
| `postcssPlugins.append`              | `PostcssPlugin[]` | `[]`               | Adds custom PostCSS plugins **after** TailwindCSS processing.                                                                                                        |
| `postcssPlugins.disableAutoprefixer` | `boolean`         | `false`            | Disable the default Autoprefixer plugin applied after TailwindCSS.                                                                                                   |
| `cssModules.enabled`                 | `boolean`         | `false`            | Enables CSS Modules support. When enabled, class names are locally scoped by default, meaning they are unique to the component and won't conflict with other styles. |
| `cssModules.filter`                  | `RegExp`          | `/\.module\.css$/` | A regular expression to detect which files should be processed as CSS Modules.                                                                                       |
| `cssModules.exclude`                 | `RegExp[]`        | `[]`               | An array of regular expressions to exclude specific files or paths from CSS Modules processing.                                                                      |

## CSS Modules

If the `cssModules.enabled` option is `true`, you can use css modules with TailwindCSS. For example:

File `button.module.css`:

```css
.button {
  @apply px-4 py-2 border-2 rounded;
  background: #faf;
}
```

File `button.jsx`:

```jsx
import styles from "./button.module.css";

export const Button = ({ label }) => {
  return <button className={styles.button}>{label}</button>;
};
```

To make css modules work more correctly, add the main CSS file to the excludes:

```js
tailwindPlugin({
  cssModules: {
    enabled: true,
    exclude: ['index.css']
  }
}),
```

## Type Definitions

To avoid TypeScript errors when importing CSS, add the types to your global declaration file:

```ts
/* globals.d.ts */

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}
```

## Using with Bun

Since Bun's bundler API is compatible with esbuild, this module can be used as a [Bun plugin](https://bun.sh/docs/bundler/plugins).

```ts
Bun.build({
  plugins: [
    tailwindPlugin({
      /* options */
    }),
  ],
});
```
