# esbuild-plugin-tailwindcss

Just a module to simplify the connection of TailwindCSS

[![npm](https://img.shields.io/npm/v/esbuild-plugin-tailwindcss.svg)](https://www.npmjs.com/package/esbuild-plugin-tailwindcss)
[![npm](https://img.shields.io/npm/dt/esbuild-plugin-tailwindcss.svg)](https://www.npmjs.com/package/esbuild-plugin-tailwindcss)
[![npm](https://img.shields.io/npm/l/esbuild-plugin-tailwindcss.svg)](https://www.npmjs.com/package/esbuild-plugin-tailwindcss)

## Install

```shell
yarn add -D esbuild-plugin-tailwindcss
```

or

```shell
npm i -D esbuild-plugin-tailwindcss
```

## Basic usage

_\* This module can be imported as ESM or CJS. The examples below use the ESM syntax._

Add plugin in build config:

```js
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss';

esbuild.build({
  plugins: [
    tailwindPlugin({
      // options
    }),
  ],
});
```

Create file `tailwind.config.js` at the root of the project:

```js
export default {
  content: ['./source/**/*.{js,jsx,ts,tsx}'],
  // ...
  // The rest of the tailwindcss configuration
  // For more, see: https://tailwindcss.com/docs/configuration
};
```

Create file `index.css`:

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

Import `index.css` from `index.{js,jsx,ts,tsx}` file:

```js
import './index.css';
```

Done, you can use the TailwindCSS in the project!

## Options

| Name                   | Type                                     | Default            | Description                                                       |
| ---------------------- | ---------------------------------------- | ------------------ | ----------------------------------------------------------------- |
| configPath             | string \| undefined                      | undefined          | Indicates the custom location of the TailwindCSS config           |
| postcssPlugins         | (PostcssPlugin \| PostcssPluginConfig)[] | []                 | Adds custom plugins to the postcss handler                        |
| cssModulesEnabled      | boolean                                  | false              | Enables processing of css modules                                 |
| cssModulesFilter       | RegExp                                   | /\\.module\\.css$/ | Sets a template for detecting css modules                         |
| cssModulesExcludePaths | RegExp[]                                 | []                 | Sets paths and files that should not be processing as css modules |

## PostCSS plugins

Tailwind and autoprefixer are already used by default.
Other plugins can be used as plain imports (e.g. `require("postcss-import")`) or as a config object.
Plugins are appended by default, but you can choose to prepend them based on your use case using the config object:

### Plugin config object

| Name    | Type          | Default | Description                                                                 |
| ------- | ------------- | ------- | --------------------------------------------------------------------------- |
| plugin  | PostcssPlugin | -       | **Mandatory**. The plugin itself, for example `require("postcss-import")`   |
| prepend | boolean       | false   | Prepends the plugin instead of appending it after tailwind and autoprefixer |

## CSS Modules

If the `cssModulesEnabled` option is `true`, you can use css modules with TailwindCSS. For example:

File `button.module.css`:

```css
.button {
  @apply px-4 px-2 border-2 rounded;
  background: #faf;
}
```

File `button.jsx`:

```jsx
import styles from './button.module.css';

export const Button = ({ label }) => {
  return <button className={styles.button}>{label}</button>;
};
```

Note: to make css modules work more correctly, add the `index.css` file (or any of your css file where you use: _@import "tailwind/\*"_) to the `cssModulesExcludePaths` option:

```js
tailwindPlugin({
  cssModulesExcludePaths: ['index.css']
}),
```
