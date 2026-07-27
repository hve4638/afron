import { useEffect, useRef, useState } from 'react';

import { appBus } from '@/events/app';
import { useOn } from '@/lib/zustbus';
import { Toast } from '@/types/toast';

type ToastWithId = Toast & { id: number };
function useToastRenderer() {
    const countRef = useRef(0);
    const timeoutRef = useRef<(NodeJS.Timeout | null)[]>([]);
    const [toasts, setToasts] = useState<ToastWithId[]>([]);

    useEffect(() => {
        return () => {
            for (const to of timeoutRef.current) {
                if (to) {
                    clearTimeout(to);
                }
            }
        }
    }, [])

    const addToast = (entry: Toast) => {
        const id = countRef.current++;
        setToasts((prev) => [
            {
                ...entry,
                id: id,
            },
            ...prev,
        ]);
        
        const timeout = setTimeout(() => {
            removeToast(id);
        }, 3000);
        timeoutRef.current.push(timeout);
    }

    useOn(appBus.on.show_toast_message, (toast) => {
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