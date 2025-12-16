import { ModalBox, ModalHeader } from '@/features/modal';
import { ModalInstanceContextProvider } from '@/features/modal/context/ModalInstance';
import { Column } from '@/components/layout';

interface MockModalProps {
    title?: string;
    showCloseButton?: boolean;
    children?: React.ReactNode;
}

export function MockModal({ 
    title = 'Modal Title',
    showCloseButton = true,
    children 
}: MockModalProps) {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            padding: '0.5em',
        }}>
            <ModalInstanceContextProvider
                focused={true}
                onClose={() => {}}
            >
                <ModalBox>
                    <Column className='hfill'>
                        <ModalHeader showCloseButton={showCloseButton}>
                            {title}
                        </ModalHeader>
                        {children}
                    </Column>
                </ModalBox>
            </ModalInstanceContextProvider>
        </div>
    );
}
