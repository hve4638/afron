import { CheckBoxForm } from '@/components/FormFields';
import { Column, Flex, Row } from '@/components/layout';
import { Modal, ModalHeader } from '@/components/Modal';
import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';
import { useProfileAPIStore } from '@/stores';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileEvent from '@/features/profile-event';
import useTrigger from '@/hooks/useTrigger';
import { CommonOptions, GPT5Options, SafetyOptions, ThinkingOptions } from './options';
import useMemoryStore from '@/stores/useMemoryStore';
import { ChatAIModel, GlobalModelConfiguration } from '@afron/types';

type ModelConfigModalProps = {
    modelId: string;
    isFocused: boolean;
    onClose: () => void;
}

function ModelConfigModal({
    modelId,
    isFocused,
    onClose = () => { },
}: ModelConfigModalProps) {
    const [disappear, closed] = useModalDisappear(onClose);
    const configRef = useRef<Partial<GlobalModelConfiguration>>({});
    const [refreshPing, refresh] = useTrigger();
    const modelMap = useMemoryStore(state => state.modelsMap);
    const { api } = useProfileAPIStore();

    const model: ChatAIModel = useMemo(() => {
        // console.log('#model Infomation', modelMap[modelId]);
        return modelMap[modelId] ?? {};
    }, [modelId, modelMap]);

    const modelName = useMemo(() => {
        return ProfileEvent.model.getName(modelId);
    }, [modelId]);

    const close = () => {
        api.globalModelConfig.set(modelId, configRef.current);
        
        closed();
    }

    useEffect(() => {
        api.globalModelConfig.get(modelId)
            .then((config) => {
                configRef.current = config;
                refresh();
            });
    }, [modelId]);

    useHotkey({
        'Escape': close,
    }, isFocused, []);

    const config = configRef.current;
    const thinkingEnabled = (model.config.thinking ?? 'disabled') !== 'disabled';5
    const safetyEnabled = (model.config.supportGeminiSafetyFilter);
    const gpt5Enabled = (model.config.supportVerbosity === true);

    return (
        <Modal
            disappear={disappear}
            style={{
                maxHeight: '80%',
                overflowY: 'auto',
            }}
            headerLabel={
                <ModalHeader
                    onClose={close}
                    children={'모델 설정: ' + modelName}
                />
            }
        >
            <Column
                style={{
                    gap: '0.3em',
                }}
            >
                <CheckBoxForm
                    label={'설정 덮어쓰기 활성화'}
                    checked={config.override_enabled ?? false}
                    onChange={(next) => {
                        config.override_enabled = next;
                        refresh();
                    }}
                />
                <small className='secondary-color' style={{ paddingLeft: '0.25em' }}>활성화 시 요청 템플릿 내 설정보다 이 옵션을 우선합니다.</small>
                <div style={{ height: '0.5em' }} />
                <CommonOptions
                    model={model}
                    config={config}
                    refresh={refresh}
                />
                {
                    gpt5Enabled &&
                    <>
                        <div style={{ height: '1em' }} />
                        <GPT5Options
                            model={model}
                            config={config}
                            refresh={refresh}
                        />
                    </>
                }
                {
                    thinkingEnabled && 
                    <>
                        <div style={{ height: '1em' }} />
                        <ThinkingOptions
                            model={model}
                            config={config}
                            refresh={refresh}
                        />
                    </>
                }
                {
                    safetyEnabled &&
                    <>
                        <div style={{ height: '1em' }} />
                        <SafetyOptions
                            model={model}
                            config={config}
                            refresh={refresh}
                        />
                    </>
                }
            </Column>
        </Modal>
    )
}

export default ModelConfigModal;