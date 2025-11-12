import { GIconButton } from '@/components/atoms/GoogleFontIcon';
import { Align, Flex, Row } from '@/components/layout';
import CopyIconButton from '@/components/ui/CopyIconButton';

import styles from './RequestPreviewModal.module.scss';
import classNames from 'classnames';

export function HeaderLine({
    label,
    content
}: { label: string; content: string; }) {
    return (
        <Row
            columnAlign={Align.Center}
            style={{
                marginBottom: '0.15em',
                gap: '0.25em',
            }}
        >
            <b>{label}</b>
            <Flex/>
            <CopyIconButton
                onClick={() => {
                    navigator.clipboard.writeText(content);
                }}
            />
        </Row>
    );
}

interface HeaderLineWithJSONProps {
    label: string;
    content: string;

    jsonPrettifyValue: boolean;
    onClickJSONPrettify: (value: boolean) => void;
}

export function HeaderLineWithJSON({
    label,
    content,
    jsonPrettifyValue,
    onClickJSONPrettify,
}: HeaderLineWithJSONProps) {
    return (
        <Row
            columnAlign={Align.Center}
            style={{
                marginBottom: '0.15em',
                gap: '0.3em',
            }}
        >
            <b>{label}</b>
            <Flex/>
            <GIconButton
                className={
                    classNames(
                        styles['prettify-btn'],
                        {
                            [styles['enabled']]: jsonPrettifyValue,
                        }
                    )
                }
                value='wand_shine'
                hoverEffect='square'
                onClick={() => onClickJSONPrettify(!jsonPrettifyValue)}
            />
            <CopyIconButton
                onClick={() => {
                    navigator.clipboard.writeText(content);
                }}
            />
        </Row>
    );
}
