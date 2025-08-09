import { useRef, useState } from 'react';

import { useEvent } from '@/hooks/useEvent';
import { Toast } from '@/types/toast';

type ToastWithId = Toast & { id: number };
function useToastRenderer() {
    const countRef = useRef(0);
    const [toasts, setToasts] = useState<ToastWithId[]>([]);

    const addToast = (entry: Toast) => {
        const id = countRef.current++;
        setToasts((prev) => [
            {
                ...entry,
                id: id,
            },
            ...prev,
        ]);
    }

    useEvent('show_toast_message', (toast) => {
        if (!toast) return;
        addToast(toast);
    }, []);


    const removeToast = (id: number) => {
        setToasts(prev => prev.filter((msg) => msg.id !== id));
    }

    return {
        toasts,
        removeToast,
    }
}

export default useToastRenderer;