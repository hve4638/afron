export const SETTING_CATEGORY = {
    GENERAL: '일반',
    API: 'API 키',
    MODELS: '모델',
    SHORTCUT: '단축키',
    SESSION: '세션',
    HISTORY: '기록',
    SERVER: '서버 (베타)',
    DATA: '데이터',
    ADVANCED: '고급',
}
export type SETTING_CATEGORY = typeof SETTING_CATEGORY[keyof typeof SETTING_CATEGORY];