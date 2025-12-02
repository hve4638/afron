import classNames from "classnames";
import { GIconButton, GoogleFontIcon } from "@/components/atoms/GoogleFontIcon";
import { Flex, Row } from "components/layout";
import { useMemo } from "react";

interface ModalHeaderProps {
    className?: string;
    style?: React.CSSProperties;
    onClose?: () => void;
    renderButton?: () => React.ReactNode;
    hideCloseButton?: boolean;
    children?: React.ReactNode;
}

function ModalHeader({
    className,
    onClose = () => { },
    hideCloseButton = false,
    renderButton,
    children,
}: ModalHeaderProps) {
    const button = useMemo(() => {
        if (renderButton) {
            return renderButton();
        }
        else if (!hideCloseButton) {
            return <GIconButton
                value='close'
                hoverEffect='square'
                onClick={() => onClose()}
            />
        }
        else {
            return <></>
        }
    }, [renderButton, hideCloseButton])

    return (
        <Row
            className={className}
            style={{
                width: '100%',
                height: '1.5em',
                marginBottom: '8px',
            }}
        >
            {
                children != null &&
                <span
                    className='center undraggable'
                    style={{
                        margin: '4px',
                        fontSize: '1.2em',
                        lineHeight: '1',
                    }}
                >{children}</span>
            }
            <Flex />
            <div
                style={{
                    fontSize: '1.5em',
                    lineHeight: '1',
                }}
            >
                {button}
            </div>
        </Row>
    )
}

export default ModalHeader;