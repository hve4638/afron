import React, { ReactNode } from 'react';
import FocusLock from 'react-focus-lock';

import { CommonProps } from '@/types';

import { ModalBackground, ModalBackgroundProps } from '../ModalBackground';
import { ModalBox } from '../ModalBox';
import { useModalHook } from './Modal.hooks';

interface ModalProps extends CommonProps {
    children?: React.ReactNode;

    header?: {
        renderOverride?: () => ReactNode;

        label?: ReactNode;
        showCloseButton?: boolean;
    }

    allowEscapeKey?: boolean;
    onClose?: () => void;

    /** @deprecated use backgroundProps.enableRoundedBackground instead. */
    enableRoundedBackground?: boolean;

    backgroundProps?: Partial<Omit<ModalBackgroundProps, 'children'>>;
}

export function Modal({
    className = '',
    style = {},
    children,

    header = {},
    allowEscapeKey = false,
    onClose,
    backgroundProps = {},
}: ModalProps) {
    const { header: headerRenderer } = useModalHook({
        header,
        allowEscapeKey,
        onClose,
    });

    return (
        <FocusLock
            autoFocus={false}
            returnFocus={false}
        >
            <ModalBackground
                {...backgroundProps}
            >
                <ModalBox
                    className={className}
                    style={{
                        minHeight: '0',
                        maxHeight: '90%',

                        display: 'grid',
                        gridTemplateRows: headerRenderer ? 'auto 1fr' : '1fr',
                        ...style,
                    }}
                >
                    {headerRenderer}
                    <div
                        style={{
                            display: 'block',
                            padding: '0.25em 0.25em 0.25em 0.15em',

                            overflowX: 'hidden',
                            overflowY: 'auto',
                        }}
                    >
                        {children}
                    </div>
                </ModalBox>
            </ModalBackground>
        </FocusLock>
    );
}

export default Modal;