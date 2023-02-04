# esbuild-plugin-tailwindcss

Just a module to simplify the connection of TailwindCSS

---

## Install

```shell
yarn add -D esbuild-plugin-tailwindcss
```

or

```shell
npm i -D esbuild-plugin-tailwindcss
```

## Usage

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

#### `configPath`

Type: _string_\
Default: _root of the project_

#### `postcssPlugins`

Type: _PostcssPlugin[]_\
Default: _[]_
