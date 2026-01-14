import { DependencyList, useEffect, useMemo } from 'react';
import { parseKeyCombination } from './utils';

type HotkeyCallbacks = {
    [key: string]: (e: KeyboardEvent) => boolean | void;
}

type ParsedCallback = {
    key: string;
    modifiers: string[];
    callback: (e: KeyboardEvent) => boolean | void;
}

/**
 * hotkey 지정 후크
 *
 * 키 조합 형식:
 * - C-c : Ctrl+C (일반키는 소문자)
 * - A-v : Alt+V
 * - C-S-a : Ctrl+Shift+A
 * - M-x : Meta+X
 * - a : 단일 키 (수식키 없음)
 * - Esc, Tab, Enter, Del : 특수키
 * - F1, F2, ..., F12 : 펑션키
 * - Ctrl, Alt, Shift, Meta : 단독 수식키
 *
 * 규칙:
 * - 일반키는 반드시 소문자 1글자만 허용 (a-z, 0-9 등)
 * - 특수키는 정의된 목록에서만 허용 (Esc, Tab, Enter, Del, F1~F12 등)
 * - 조합키 약어는 C(Ctrl), A(Alt), S(Shift), M(Meta)만 허용
 * - 여러 일반키 조합 불가 (예: C-ab는 에러)
 * - 단독 수식키는 전체 이름 사용 (예: Ctrl, Alt)
 * - 규칙 위반 시 console.warn 출력 후 무시됨
 *
 * @param hotkey Record<string, hook> 형식, hook 반환값이 true라면 stopPropagation 및 preventDefault 호출됨
 * @param deps 값 제공 시, deps가 변경될 때마다 hotkey가 재설정됨
 * @param enabled {boolean} false 일 경우 hotkey가 비활성화 됨
 */
export function useKeyBind(hotkey: HotkeyCallbacks, deps?: DependencyList, enabled: boolean = true) {
    const parsedCallbacks = useMemo(() => {
        const parsed: ParsedCallback[] = [];
        for (const keyCombination in hotkey) {
            const result = parseKeyCombination(keyCombination);
            // 유효하지 않은 키 조합은 무시
            if (result === null) {
                continue;
            }
            const { key, modifiers } = result;
            parsed.push({
                key,
                modifiers,
                callback: hotkey[keyCombination]
            });
        }
        return parsed;
    }, [hotkey]);

    const dependencyList: DependencyList = deps ? [...deps, enabled] : [enabled];

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();

            // 각 파싱된 콜백과 비교
            for (const { key: targetKey, modifiers, callback } of parsedCallbacks) {
                // 키가 일치하는지 확인
                if (key !== targetKey) continue;

                // 모든 수식키가 일치하는지 확인
                const hasCtrl = modifiers.includes('ctrl');
                const hasAlt = modifiers.includes('alt');
                const hasShift = modifiers.includes('shift');
                const hasMeta = modifiers.includes('meta');

                if (
                    e.ctrlKey === hasCtrl &&
                    e.altKey === hasAlt &&
                    e.shiftKey === hasShift &&
                    e.metaKey === hasMeta
                ) {
                    if (callback(e) ?? true) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    break; // 매칭되면 더 이상 확인하지 않음
                }
            }
        }

        if (enabled) {
            window.addEventListener('keydown', listener);

            return () => window.removeEventListener('keydown', listener);
        }
    }, dependencyList);
}