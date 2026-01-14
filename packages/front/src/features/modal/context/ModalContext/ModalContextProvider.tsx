import { ReactNode, useRef, useState } from 'react';

import { ModalInstanceContextProvider } from '../ModalInstance/ModalInstanceProvider';
import { ModalContext } from './ModalContext';

interface ModalData {
    node: ReactNode;
    key: any;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const counter = useRef(0);
    const [modals, setModals] = useState<ModalData[]>([]);

    const openModal = (node: ReactNode) => {
        setModals((prev) => [...prev, { node, key: counter.current++ }]);
    }

    const closeModal = (modalKey: any) => {
        setModals((prev) => prev.filter((d) => d.key !== modalKey));
    }

    return (
        <ModalContext.Provider value={{
            open: openModal,
            count: modals.length,
        }}>
            {children}
            {
                modals.map(({ node, key }, index) => (
                    <ModalInstanceContextProvider
                        key={key}
                        focused={index === modals.length - 1}
                        onClose={() => closeModal(key)}
                    >
                        {node}
                    </ModalInstanceContextProvider>
                ))
            }
        </ModalContext.Provider>
    );
}