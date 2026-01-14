import { useTranslation } from 'react-i18next';
import { GoogleFontIcon } from '@/components/atoms/GoogleFontIcon';
import { Modal, ModalHeader } from '@/features/modal';
import { Align, Center, Column, Grid, Row } from '@/components/layout';

type AddPromptModalProps = {
    onAddPrompt: (type: 'simple' | 'node') => void;
}

function AddPromptModal({
    onAddPrompt = () => { },
}: AddPromptModalProps) {
    const { t } = useTranslation();

    return (
        <Modal
            style={{
                minWidth: '400px',
                width: 'auto',
            }}
            header={{
                label: t('rt.create-rt-title'),
                showCloseButton: true,
            }}
            allowEscapeKey={true}
        >
            <Row
                rowAlign={Align.Start}
                columnAlign={Align.Center}
            >
                <RTTypeButton value='description' text={t('rt.create-simple-prompt')} />
                <div style={{ width: '4px' }} />
                <RTTypeButton value='polyline' text={t('rt.create-node-flow-mode')} />
            </Row>
            <div style={{ height: '8px' }} />
        </Modal>
    )
}

type RTTypeButtonProps = {
    value: string;
    text: string;
}

function RTTypeButton({
    value, text
}: RTTypeButtonProps) {
    return (
        <Grid
            className='prompt-add-button'
            columns='80px'
            rows='64px 16px 4px'
            style={{
                padding: '0.5em',
            }}
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

export default AddPromptModal;