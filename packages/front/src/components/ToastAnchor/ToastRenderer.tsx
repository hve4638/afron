import { Column } from '@/components/layout';

import { useModal } from '@/hooks/useModal';
import ErrorLogModal from '@/modals/ErrorLogModal';

import { Z_INDEX_TOAST } from '@/data/z';

import { ToastMessage } from './ToastMessage';
import useToastRenderer from './ToastRenderer.hook';
import { emitEvent } from '@/hooks/useEvent';

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
                zIndex: Z_INDEX_TOAST,
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
                        }}
                        onDispose={() => removeToast(toast.id)}
                    />
                ))
            }
        </Column>
    )
}

export default ToastRenderer;