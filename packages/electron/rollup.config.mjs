import { builtinModules } from 'node:module';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

// 순수 JS 의존성은 전부 번들에 인라인하고 네이티브 모듈만 external로 남긴다.
// 패키징 시 electron-builder의 node_modules 재구성(pnpm 레이아웃 평탄화)에
// 런타임 resolve를 의존하지 않기 위함 (lazystream/signal-exit 계열 크래시 방지)
const NATIVE_MODULES = ['electron', 'better-sqlite3', 'sharp'];
const BUILTINS = new Set([...builtinModules, ...builtinModules.map((m) => `node:${m}`)]);

export default [
  {
    input: {
      'main': 'src/main.ts',
      'preload/preload': 'src/preload/preload.ts',
    },
    output: [
      {
        dir: "dist",
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        preferBuiltins: true,
        exportConditions: ['node'],
      }),
      commonjs({
        ignoreDynamicRequires: true,
        transformMixedEsModules: true,
      }),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        clean: true,
      }),
      // terser(),
    ],
    external: (id) => BUILTINS.has(id) || NATIVE_MODULES.some((m) => id === m || id.startsWith(`${m}/`)),
  }
]
