import { createContext } from 'react';

interface ModalState {
    /** 현재 modal이 상단에 포커스 되어 있는지 여부 */
    focused: boolean;
    /** 모달이 사라지는 중인지 여부 */
    disappear: boolean;
    /** 모달 닫기 */
    closeModal: () => void;
    /** 모달 닫기 ESC 키 바인딩 사용 */
    useCloseKeyBind: () => void;
}

export const ModalInstanceContext = createContext<ModalState | null>(null);