export function formatRelative(
    saved: Date | string | number,
    now: Date = new Date()
): string {
    const savedDate = new Date(saved);
    let diffMs = now.getTime() - savedDate.getTime();
    if (diffMs < 0) diffMs = 0; // 미래값 방어

    const min = 60_000;
    const hour = 60 * min;
    const day = 24 * hour;
    const week = 7 * day;

    if (diffMs < min) return '방금';
    if (diffMs < hour) return `${Math.floor(diffMs / min)}분 전`;
    if (diffMs >= 24 * hour && diffMs < 48 * hour) return '어제';
    if (diffMs < week) return `${Math.floor(diffMs / day)}일 전`;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return new Intl.DateTimeFormat('ko-KR', {
        year: '2-digit', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZone
    }).format(savedDate)
        .replace(/\./g, '.'); // 구분자 통일 (예: '25.08.09 14:23:05')
}
