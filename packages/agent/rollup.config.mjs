import { builtinModules } from 'module';
import { resolve } from 'path';
import { readFileSync } from 'fs';

import alias from '@rollup/plugin-alias';
import typescript from '@rollup/plugin-typescript';
import run from '@rollup/plugin-run';

const pkg = JSON.parse(readFileSync('package.json'));

/** @type {import('@rollup/plugin-alias').RollupAliasOptions} */
const aliasConfig = {
  entries: [
    { find: '@', replacement: resolve('src') },
  ],
};

/** @type {import('rollup').ExternalOption} */
const external = [
  ...builtinModules,
  ...Object.keys(pkg.dependencies || {}),
];

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input: 'src/main.ts',
    output: {
      file: 'dist/main.js',
      format: 'es',
    },
    plugins: [
      alias(aliasConfig),
      typescript(),
      ...[process.env.RUN == 'true' ? run() : []],
    ],
    external,
  },
];
