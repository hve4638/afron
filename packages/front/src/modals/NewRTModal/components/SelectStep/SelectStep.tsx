import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { RT_WORKFLOW_ENABLED } from '@/constants';
import { GoogleFontIcon } from '@/components/atoms/GoogleFontIcon';
import { Align, Center, Grid, Row } from '@/components/layout';

import style from './SelectStep.module.scss';

type RTSelectWidgetProps = {
    onPrev: () => void;
    onSelectRTType: (type: 'prompt_only' | 'flow') => void;
}

export function SelectStep(props: RTSelectWidgetProps) {
    const { t } = useTranslation();

    return (
        <Row
            rowAlign={Align.Center}
            columnAlign={Align.Center}
        >
            <RTTypeButton
                value='description'
                text={t('rt.select_prompt_only_mode_button')}
                onClick={() => {
                    props.onSelectRTType('prompt_only');
                }}
            />
            <div style={{ width: '4px' }} />
            <RTTypeButton
                value='polyline'
                text={t('rt.select_flow_mode_button')}
                onClick={() => {
                    props.onSelectRTType('flow');
                }}
                disabled={!RT_WORKFLOW_ENABLED}
            />
        </Row>
    )
}

type RTTypeButtonProps = {
    value: string;
    text: string;
    onClick: () => void;
    disabled?: boolean;
}

function RTTypeButton({
    value, text, onClick, disabled = false
}: RTTypeButtonProps) {
    return (
        <Grid
            className={
                classNames(
                    style['rt-type-select'],
                    { 'disabled': disabled },
                    'undraggable'
                )
            }
            columns='120px'
            rows='64px 16px 4px'
            style={{
                padding: '0.5em',
            }}
            onClick={() => {
                if (disabled) return;
                onClick();
            }}
            tabIndex={0}
        >
            <Center>
                <GoogleFontIcon
                    style={{
                        height: 'auto',
                        fontSize: '36px',
                    }}
                    value={value}
                />
            </Center>
            <span
                className='flex'
                style={{
                    textAlign: 'center',
                }}
            >
                <small>{text}</small>
            </span>
        </Grid>
    );
}