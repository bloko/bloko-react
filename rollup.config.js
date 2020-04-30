import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
    },
    external: ['react', 'axios', '@babel/runtime'],
    plugins: [
      replace({
        delimiters: ['', ''],
        values: {
          '@bloko/js': '@bloko/js/dist',
        },
      }),
      resolve(),
      commonjs({
        exclude: 'src/**',
      }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      sizeSnapshot(),
    ],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.min.js',
      format: 'cjs',
      exports: 'named',
      indent: false,
    },
    external: ['react', 'axios', '@babel/runtime'],
    plugins: [
      replace({
        delimiters: ['', ''],
        values: {
          '@bloko/js': '@bloko/js/dist/index.min',
        },
      }),
      resolve(),
      commonjs({
        exclude: 'src/**',
      }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      terser(),
      sizeSnapshot(),
    ],
  },
];
