import { ReactNode, useCallback, useMemo } from "react";
import { ModalHeader } from "../ModalHeader";
import { useModalInstance } from "@/features/modal";
import { useKeyBind } from "@/hooks/useKeyBind";

interface UseModalProps {
    header: {
        renderOverride?: () => ReactNode;

        label?: ReactNode;
        showCloseButton?: boolean;
    }

    allowEscapeKey: boolean;
    onClose?: () => void;
}

export function useModalHook({
    header: {
        renderOverride,
        label,
        showCloseButton,
    },
    allowEscapeKey,
    onClose,
}: UseModalProps) {
    const { closeModal, focused, } = useModalInstance();

    const closed = useCallback(() => {
        onClose?.();
        closeModal();
    }, [onClose, closeModal]);

    useKeyBind({
        'Escape': closed,
    }, [closeModal], focused && allowEscapeKey);

    const header = useMemo(() => {
        if (renderOverride) {
            return renderOverride();
        }
        if (label) {
            return (
                <ModalHeader
                    onClose={closed}
                    showCloseButton={showCloseButton}
                >{label}</ModalHeader>
            )
        }
        else if (!showCloseButton) {
            return null;
        }
    }, [renderOverride, label, showCloseButton, closed]);

    return {
        header,
    }
}