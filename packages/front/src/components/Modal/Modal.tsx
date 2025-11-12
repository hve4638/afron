import React, { ReactNode } from 'react';
import FocusLock from 'react-focus-lock';

import ModalBackground, { ModalBackgroundProps } from './ModalBackground';
import ModalBox from './ModalBox';
import { CommonProps } from '@/types';
import useHotkey from '@/hooks/useHotkey';
import { useKeyBind } from '@/hooks/useKeyBind';


interface ModalProps extends CommonProps {
    children?: React.ReactNode,

    headerLabel?: ReactNode,
    disappear?: boolean,

    onEscapeAction?: () => void;
    focused?: boolean;

    /** @deprecated use backgroundProps.enableRoundedBackground instead. */
    enableRoundedBackground?: boolean;

    backgroundProps?: Partial<Omit<ModalBackgroundProps, 'children'>>;
}

function Modal({
    className = '',
    style = {},
    children,

    headerLabel,
    disappear = false,

    onEscapeAction,
    focused = true,

    backgroundProps = {},
}: ModalProps) {
    useKeyBind({
        'Esc': (e) => {
            if (onEscapeAction) onEscapeAction();
        }
    }, [focused, onEscapeAction], focused && (onEscapeAction != null))

    const hasHeader = !!headerLabel;

    return (
        <>
            <FocusLock
                autoFocus={false}
                returnFocus={false}
            >
                <ModalBackground
                    disappear={disappear}
                    {...backgroundProps}
                >
                    <ModalBox
                        className={className}
                        style={{
                            minHeight: '0',
                            maxHeight: '90%',

                            display: 'grid',
                            gridTemplateRows: hasHeader ? 'auto 1fr' : '1fr',
                            ...style,

                        }}
                        disappear={disappear}
                    >
                        {headerLabel}
                        <div
                            style={{
                                display: 'block',
                                padding: '0.25em 0.25em 0.25em 0.15em',

                                overflowX: 'hidden',
                                overflowY: 'auto',
                            }}
                        >
                            {
                                children != null &&
                                children
                            }
                        </div>
                    </ModalBox>
                </ModalBackground>
            </FocusLock>
        </>
    );
}

export default Modal;