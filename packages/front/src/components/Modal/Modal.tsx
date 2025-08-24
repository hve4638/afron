import React, { ReactNode } from 'react';
import { Column, Flex, Grid, Row } from 'components/layout';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import classNames from 'classnames';
import ModalBackground, { ModalBackgroundProps } from './ModalBackground';
import ModalBox from './ModalBox';
import FocusLock from 'react-focus-lock';
import { CommonProps } from '@/types';
import useHotkey from '@/hooks/useHotkey';


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
    useHotkey({
        'Escape': (e) => {
            if (onEscapeAction) {
                onEscapeAction();
                return true;
            }
        }
    }, focused && (onEscapeAction != null), [focused, onEscapeAction]);

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