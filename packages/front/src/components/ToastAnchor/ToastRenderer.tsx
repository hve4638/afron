import { Column } from '@/components/layout';

import { useModal } from '@/hooks/useModal';

import { Z_INDEX } from '@/constants';

import { ToastMessage } from './ToastMessage';
import useToastRenderer from './ToastRenderer.hook';
import { emitEvent } from '@/hooks/useEvent';
import InfoModal from '@/modals/InfoModal/InfoModal';

interface ToastRendererProps {
    top?: string;
    right?: string;
    left?: string;
    bottom?: string;
}

function ToastRenderer({
    top, right, left, bottom
}: ToastRendererProps) {
    const modal = useModal();

    const {
        toasts,
        removeToast,
    } = useToastRenderer();

    return (
        <Column
            style={{
                position: 'absolute',
                top,
                right,
                left,
                bottom,
                margin: '6px',
                gap: '4px',
                zIndex: Z_INDEX.TOAST,
            }}
        >
            {
                toasts.map((toast, index) => (
                    <ToastMessage
                        key={toast.id}
                        value={toast}

                        onClick={() => {
                            if (toast.clickAction.action === 'open_error_log') {
                                emitEvent('open_error_log', toast.clickAction.error_id);
                            }
                            else if (toast.clickAction.action === 'open_info') {
                                modal.open(InfoModal, {
                                    item: toast.clickAction.item,
                                });
                                
                            }
                        }}
                        onDispose={() => removeToast(toast.id)}
                    />
                ))
            }
        </Column>
    )
}

export default ToastRenderer;