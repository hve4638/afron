import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import ts from 'rollup-plugin-ts';
import dts from 'rollup-plugin-dts';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/bundle.cjs',
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: 'dist/bundle.mjs',
                format: 'es',
                sourcemap: true,
            },
        ],
        plugins: [
            // resolve() // 번들링 호환 문제로 resolve() 사용하지 않음
            commonjs(), // 필요시 CommonJS 변환
            json(),
            ts({ tsconfig: './tsconfig.json' }), // TypeScript 변환
            // terser(), // 코드 압축 (필요시 활성화)
        ],
        external: [
            'write-file-atomic',
        ]
    },
    {
        input: 'src/index.ts', // 또는 .d.ts 합친 엔트리
        output: {
            file: 'dist/index.d.ts',
            format: 'es',
        },
        plugins: [
            dts({
                compilerOptions: {
                    "baseUrl": "./",
                    "paths": {
                        "@/*": ["src/*"],
                    }
                },
            }),
        ],
    }
];