import { useContextForce } from '@/context';
import useModalDisappear from '@/hooks/useModalDisappear';
import { createContext } from 'react';
interface ModalState {
    focused: boolean;
    disappear: boolean;
    closeModal: () => void;
}

const ModalInstanceContext = createContext<ModalState | null>(null);

interface ModalContextProviderProps {
    children?: React.ReactNode;

    focused: boolean;
    onClose: () => void;
}

export function ModalInstanceContextProvider({ children, focused, onClose }: ModalContextProviderProps) {
    const [disappear, closeModal] = useModalDisappear(onClose);

    return (
        <ModalInstanceContext.Provider
            value={{
                focused,
                disappear,
                closeModal,
            }}
        >
            {children}
        </ModalInstanceContext.Provider>
    )
}

export function useModalInstance() {
    return useContextForce(ModalInstanceContext);
}