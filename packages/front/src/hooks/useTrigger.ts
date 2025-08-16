import { useState } from 'react';

/**
 * 단순 리렌더링을 위한 훅, useRef 등의 값을 수정하며 반영이 필요한 경우 사용함
 */
function useRerender() {
    const [ping, setPing] = useState<number>(0);

    return [
        ping,
        ()=>setPing(prev=>prev+1)
    ] as const;
}

export default useRerender;