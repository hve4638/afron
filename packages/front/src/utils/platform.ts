/** 빌드 타깃 판별. vite alias(@/api/local 분기)와 동일한 VITE_BACKEND 기준을 사용한다. */
export const isWeb = import.meta.env['VITE_BACKEND'] === 'web';
