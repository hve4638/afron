import { useRef } from 'react';

import { createBus } from './createBus';
import { Bus, EventMap } from './types';

/**
 * 컴포넌트 인스턴스별 지역 이벤트 버스 생성
 *
 * @returns `Bus<E>` 핸들. 컴포넌트 생명주기 동안 동일 참조 유지
 */
export function useBus<E extends EventMap>(): Bus<E> {
    const ref = useRef<Bus<E> | null>(null);
    if (!ref.current) ref.current = createBus<E>();
    return ref.current;
}
