/**
 * 배열 a가 배열 b의 모든 요소를 포함하는지 확인
 * 
 * @param a 
 * @param b 
 * @param compare 
 * @returns 
 */
export function includesAll<T, U>(
    sources: T[],
    parts: U[],
    compare: (source: T, part: U) => boolean = (a, b) => ((a as any) == (b as any))
): boolean {
    for (const bi of parts) {
        if (!sources.find(ai => compare(ai, bi))) {
            return false;
        }
    }
    return true;
}

/**
 * 두 배열이 동일한 요소를 포함하는지 확인
 * 
 * @param a 
 * @param b 
 * @param compare 
 * @returns 
 */
export function matchesAll<T, U>(
    a: T[],
    b: U[],
    compare: (a: T, b: U) => boolean = (a, b) => ((a as any) == (b as any))
): boolean {
    if (a.length !== b.length) return false;

    let matchFlags = new Array(a.length).fill(false);
    for (let i = 0; i < b.length; i++) {
        if (!a.find((ai, i) => compare(ai, b[i]) && !matchFlags[i])) {
            return false;
        }
        else {
            matchFlags[i] = true;
        }
    }

    return true;
}