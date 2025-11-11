import { useEffect, useState } from 'react';
import { MODAL_DISAPPEAR_DURATION_MS } from '@/constants';

/**
 * Modal fade-in/out 효과를 위한 hook
 * 
 * @param onClose : close 호출 시 fade-out 효과 이후 호출
 * @returns [disappear, close] : [fade-out 중인지 여부, close 함수]
 */
function useModalDisappear(onClose: () => void, duration: number = MODAL_DISAPPEAR_DURATION_MS) {
    const [disappear, setDisappear] = useState(true);

    useEffect(() => {
        // 초기 랜더링 시 페이드인 효과를 위해 1ms 후 false로 변경
        // 즉시 변경시 css 효과가 적용되지 않음
        const t = window.setTimeout(() => {
            setDisappear(false);
        }, 1);
        return () => {
            window.clearTimeout(t);
        };
    }, []);

    const closeModal = () => {
        setDisappear(true);
        window.setTimeout(() => {
            onClose();
        }, duration);
    }

    return [disappear, closeModal] as [boolean, () => void];
}


export default useModalDisappear;