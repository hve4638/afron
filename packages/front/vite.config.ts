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

export default defineConfig({
    base: './',
    server: {
        port : 3600,
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
