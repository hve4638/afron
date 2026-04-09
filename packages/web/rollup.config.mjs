import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';

export default [
  {
    input: ['src/server.ts'],
    output: [
      {
        dir: "dist",
        format: 'cjs',
        preserveModules: true,
        sourcemap: true,
      },
    ],
    plugins: [
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        clean: true,
      }),
    ],
    external: [
      /node_modules/,
    ],
  }
]
