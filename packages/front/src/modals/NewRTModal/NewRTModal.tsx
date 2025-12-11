import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, ModalHeader, useModalInstance } from '@/features/modal';
import ProfileEvent from '@/features/profile-event';

import { RTSelectStep, EditMetadataStep } from './step';
import { RTMode } from '@afron/types';

const enum NewRTModalSteps {
    SelectRTType = 0,
    EditMetadata = 1,
}

type NewRTModalProps = {
    onAddRT: (rtId: string, rtMode: RTMode) => void;
}

export function NewRTModal({
    onAddRT = () => { },
}: NewRTModalProps) {
    const { t } = useTranslation();
    const { closeModal } = useModalInstance();
    const [step, setStep] = useState<NewRTModalSteps>(NewRTModalSteps.SelectRTType);
    const [rtMode, setRTMode] = useState<RTMode>('prompt_only');

    return (
        <Modal
            style={{
                width: 'auto',
                maxWidth: '80%',
            }}
            allowEscapeKey={true}
        >
            <ModalHeader onClose={closeModal}>{t('rt.new_rt_title')}</ModalHeader>
            {
                step === NewRTModalSteps.SelectRTType &&
                <RTSelectStep
                    onPrev={closeModal}
                    onSelectRTType={(selected) => {
                        setRTMode(selected);
                        setStep(NewRTModalSteps.EditMetadata);
                    }}
                />
            }
            {
                step === NewRTModalSteps.EditMetadata &&
                <EditMetadataStep
                    rtMode={rtMode}
                    onPrev={() => {
                        setStep(NewRTModalSteps.SelectRTType);
                    }}
                    onConfirm={async (metadata) => {
                        await ProfileEvent.rt.create({
                            name: metadata.name,
                            id: metadata.id,
                            mode: rtMode,
                        }, metadata.templateId);

                        onAddRT(metadata.id, rtMode);
                    }}
                />
            }
        </Modal>
    )
}