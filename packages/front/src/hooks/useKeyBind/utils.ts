/**
 * 특수키 목록 (대문자 시작 허용)
 */
const SPECIAL_KEYS = new Set([
    'Escape', 'Esc',
    'Tab',
    'Delete', 'Del',
    'Enter',
    'Backspace',
    'Space',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'Home', 'End',
    'PageUp', 'PageDown',
    'Insert',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
]);

/**
 * 수식키 약어 매핑
 */
const MODIFIER_MAP: Record<string, string> = {
    'C': 'ctrl',
    'A': 'alt',
    'S': 'shift',
    'M': 'meta',
};

/**
 * 유효한 수식키 목록 (단독 사용 가능)
 */
const VALID_STANDALONE_MODIFIERS = new Set(['Ctrl', 'Alt', 'Shift', 'Meta']);

/**
 * 키 조합 문자열을 파싱합니다.
 *
 * 형식:
 * - C-c : Ctrl+C (일반키는 소문자)
 * - A-v : Alt+V
 * - C-S-a : Ctrl+Shift+A
 * - M-x : Meta+X
 * - Esc : Escape (특수키)
 * - Enter : Enter
 * - F1 : F1
 * - Ctrl : Ctrl (단독 수식키)
 *
 * 규칙:
 * - 일반키는 반드시 소문자 1글자
 * - 특수키는 정의된 목록에서만 허용
 * - 조합키는 C, A, S, M만 허용
 * - 여러 일반키 조합 불가 (예: C-ab)
 *
 * @param keyCombination 파싱할 키 조합 문자열
 * @returns key와 modifiers를 포함한 객체, 유효하지 않으면 null
 */
export function parseKeyCombination(keyCombination: string): { key: string; modifiers: string[] } | null {
    const parts = keyCombination.split('-');
    const keyPart = parts.pop() || '';

    // 수식키 파싱
    const modifiers: string[] = [];
    for (const part of parts) {
        const modifier = MODIFIER_MAP[part];
        if (!modifier) {
            console.warn(`[useKeyBind] 잘못된 조합키: "${part}" in "${keyCombination}"`);
            return null;
        }
        modifiers.push(modifier);
    }

    // 키가 비어있는 경우
    if (!keyPart) {
        console.warn(`[useKeyBind] 키가 지정되지 않음: "${keyCombination}"`);
        return null;
    }

    // 단독 수식키인지 확인
    if (parts.length === 0 && VALID_STANDALONE_MODIFIERS.has(keyPart)) {
        return { key: keyPart.toLowerCase(), modifiers: [] };
    }

    // 특수키인지 확인
    if (SPECIAL_KEYS.has(keyPart)) {
        // 특수키는 소문자로 변환하여 저장
        return { key: keyPart.toLowerCase(), modifiers };
    }

    // 일반키 검증
    // 1. 길이가 1이 아닌 경우
    if (keyPart.length !== 1) {
        console.warn(`[useKeyBind] 여러 일반키 조합 불가: "${keyPart}" in "${keyCombination}"`);
        return null;
    }

    // 2. 소문자가 아닌 경우
    if (keyPart !== keyPart.toLowerCase()) {
        console.warn(`[useKeyBind] 일반키는 소문자만 허용: "${keyPart}" in "${keyCombination}"`);
        return null;
    }

    return { key: keyPart, modifiers };
}