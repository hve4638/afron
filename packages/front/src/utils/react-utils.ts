
/**
 * React.Activity의 mode 속성에 사용할 수 있는 유틸 함수
 * 
 * @param condition - true면 `visible`, false면 `hidden` 반환
 */
export function visibility(condition: boolean) {
    return condition ? 'visible' : 'hidden';
}