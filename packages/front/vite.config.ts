import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

function alias(find:string, replacement:string) {
    return {
        find : find,
        replacement : path.resolve(__dirname, replacement)
    }
}

const backendMode = process.env.VITE_BACKEND ?? 'electron';
// @afron/web 서버 포트와 동일한 env로 프록시 대상을 맞춤 (packages/web/.env의 AFRON_PORT 기본값과 동기화)
const backendPort = process.env.AFRON_PORT ?? '8537';
const frontPort = Number(process.env.AFRON_FRONT_PORT ?? '8536');

export default defineConfig({
    base: './',
    server: {
        port: frontPort,
        host: '0.0.0.0',
        ...(backendMode === 'web' && {
            proxy: {
                '/api': `http://localhost:${backendPort}`,
                '/ws': { target: `ws://localhost:${backendPort}`, ws: true },
            },
        }),
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router',
            'react-router-dom',
            'zustand',
            '@xyflow/react',
            '@monaco-editor/react',
            'i18next',
            'react-i18next',
            '@emotion/react',
            '@emotion/styled',
        ],
    },
    plugins: [
        react(),
        // react({
        //     babel: {
        //         plugins: [
        //             ['babel-plugin-react-compiler'],
        //         ],
        //     },
        // }),
        tailwindcss(),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern'
            }
        }
    },
    resolve: {
        alias: [
            // api/local → backend별 분기 (정확한 경로만 매칭)
            {
                find: /^@\/api\/local$/,
                replacement: path.resolve(__dirname, `src/api/local/${backendMode}`),
            },
            {
                find: /^api\/local$/,
                replacement: path.resolve(__dirname, `src/api/local/${backendMode}`),
            },
            alias('@', 'src'),
            alias('data', 'src/data'),
            alias('components', 'src/components'),
            alias('context', 'src/context'),
            alias('utils', 'src/utils'),
            alias('lib', 'src/lib'),
            alias('api', 'src/api'),
            alias('types', 'src/types'),
            alias('hooks', 'src/hooks'),
            alias('assets', 'src/assets'),
            alias('pages', 'src/pages'),
            alias('features', 'src/features'),
            alias('locales', 'src/locales'),
            alias('modals', 'src/modals'),
        ]
    }
})
