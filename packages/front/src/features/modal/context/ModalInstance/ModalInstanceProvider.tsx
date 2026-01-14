import { useKeyBind } from '@/hooks/useKeyBind';
import useModalDisappear from '@/hooks/useModalDisappear';
import { ModalInstanceContext } from './ModalInstanceContext';

interface ModalContextProviderProps {
    children?: React.ReactNode;

    focused: boolean;
    onClose: () => void;
}

export function ModalInstanceContextProvider({ children, focused, onClose }: ModalContextProviderProps) {
    const [disappear, closeModal] = useModalDisappear(onClose);

    const useCloseKeyBind = () => {
        useKeyBind({
            'Escape': closeModal,
        }, [closeModal], focused);
    }

    return (
        <ModalInstanceContext.Provider
            value={{
                focused,
                disappear,
                closeModal,
                useCloseKeyBind,
            }}
            
        >
            {children}
        </ModalInstanceContext.Provider>
    )
}

