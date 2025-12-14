import { Activity, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, useModalInstance } from '@/features/modal';
import ProfileEvent from '@/features/profile-event';

import { SelectStep, EditMetadataStep } from './components';
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

    const selectStep = step === NewRTModalSteps.SelectRTType;
    const editStep = step === NewRTModalSteps.EditMetadata;

    return (
        <Modal
            style={{
                width: 'auto',
                maxWidth: '80%',
            }}
            allowEscapeKey={true}
            header={{
                label: t('rt.new_rt_title'),
                showCloseButton: true,
            }}
        >
            <Activity
                mode={selectStep ? 'visible' : 'hidden'}
            >
                <SelectStep
                    onPrev={closeModal}
                    onSelectRTType={(selected) => {
                        setRTMode(selected);
                        setStep(NewRTModalSteps.EditMetadata);
                    }}
                />
            </Activity>
            <Activity
                mode={editStep ? 'visible' : 'hidden'}
            >
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
            </Activity>
        </Modal>
    )
}