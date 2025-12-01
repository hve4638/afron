
/**
 * 조건에 맞는 값을 생성
 * 
 * @param gen 
 * @param validate
 * @returns 
 */
export function genUntil<T, K=unknown>(
    gen: (tryCount: number) => T,
    validate: (item: T, tryCount: number) => boolean,
    limitTryCount: number = 1000,
): [T, number] {
    let count = 0;
    while (true) {
        const item = gen(count);
        if (validate(item, count)) {
            return [item, count];
        }
        if (count >= limitTryCount) {
            throw new Error('genUntil: Exceeded limit try count');
        }
        count++;
    }
}