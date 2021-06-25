const {join} = require('path');
const {nodeResolve} = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const esbuild = require('rollup-plugin-esbuild');
const alias = require('@rollup/plugin-alias');
const json = require('@rollup/plugin-json');

module.exports = (env = 'production') => {
  return {
    input: join(__dirname, '../src/main/index.ts'),
    output: {
      file: join(__dirname, '../dist/main/build.js'),
      format: 'cjs',
      name: 'ElectronMainBundle',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({ jsnext: true, preferBuiltins: true, browser: true }),
      commonjs(),
      json(),
      esbuild({
        include: /\.[jt]sx?$/,
        exclude: /node_modules/,
        sourceMap: false,
        minify: process.env.NODE_ENV === 'production',
        target: 'es2017',
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
        define: {
          __VERSION__: '"x.y.z"'
        },
        loaders: {
          '.json': 'json',
          '.js': 'jsx'
        },
      }),
      alias({
        entries: [
          { find: '@main', replacement: join(__dirname, '../src/main'), },
        ]
      })
    ],
    external: [
      'crypto',
      'assert',
      'fs',
      'util',
      'os',
      'events',
      'child_process',
      'http',
      'https',
      'path',
      'electron',
    ],
  }
}
