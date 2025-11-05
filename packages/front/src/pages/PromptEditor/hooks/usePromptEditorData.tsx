import { SetStateAction, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBus } from '@/lib/zustbus';
import { PromptData } from '@/types';
import { ModelConfiguration, RTVar, RTVarConfig, RTVarDataNaive } from '@afron/types';
import { genUntil } from '@/utils/genUntil';
import { PromptVar } from '@/types/prompt-var';
import { PromptDataUpdateEvent } from '../types/events';
import { ActionFail } from '../errors';
import { getDefaultConfig } from './utils';

interface usePromptEditorProps {
}
export function usePromptEditorData({

}: usePromptEditorProps) {
    const { t } = useTranslation();
    const [promptData, setPromptData] = useState<PromptData | null>(null);
    const promptDataRef = useRef<PromptData | null>(null);

    const [emitPromptDataUpdateEvent, usePromptDataUpdateEvent] = useBus<PromptDataUpdateEvent>();

    const refresh = () => {
        emitPromptDataUpdateEvent('updated');
        setPromptData(promptDataRef.current);
    }

    useLayoutEffect(() => {
        // promptDataRef.current = initPromptData;
    }, []);

    const setName = (name: string) => {
        if (!promptDataRef.current) return;
        promptDataRef.current.name = name;
        promptDataRef.current.changed.name = true;

        refresh();
    }

    const setVersion = (verison: string) => {
        if (!promptDataRef.current) return;
        promptDataRef.current.version = verison;
        promptDataRef.current.changed.version = true;

        refresh();
    }

    const setContents = (contents: string) => {
        if (!promptDataRef.current) return;
        promptDataRef.current.contents = contents;
        promptDataRef.current.changed.contents = true;

        refresh();
    }

    const setModelConfig = (model: ModelConfiguration) => {
        setPromptData((prev) => {
            if (!prev) return prev;

            const next = { ...prev };
            if (!next.promptOnly.enabled) return prev;

            next.promptOnly.model = model;
            next.changed.model = true;
            return next;
        });
    }
    const setConfig = (config: PromptData['config']) => {
        if (!promptDataRef.current) return;
        promptDataRef.current.config = config;
        promptDataRef.current.changed.config = true;

        refresh();
    }
    const setVar = (varId: string, rtVar: PromptVar | ((prev: PromptVar) => PromptVar)) => {
        if (!promptDataRef.current) return new ActionFail('data not loaded');

        const varIndex = promptDataRef.current.variables.findIndex((item) => item.id === varId);
        if (varIndex === -1) throw new ActionFail('Could not find variable: ' + varId);

        if (typeof rtVar === 'function') {
            rtVar = rtVar(promptDataRef.current.variables[varIndex]);
        }

        promptDataRef.current.variables[varIndex] = rtVar;
        promptDataRef.current.changedVariables[varId] = rtVar;
        refresh();
    }
    const addVar = () => {
        if (!promptDataRef.current) return;

        const promptData = promptDataRef.current;
        const [varId] = genUntil(
            (i) => `temporary-${i}`,
            (vId) => promptData.variables.some((item) => item.id === vId),
        );
        const [varName, varIndex] = genUntil(
            (i) => `variable_${i}`,
            (name) => promptData.variables.some((item) => item.name === name),
        );

        const newRTVar: PromptVar = {
            id: varId,
            include_type: 'form',
            name: varName,
            form_name: t('prompt_editor.variable_default_name') + ' ' + varIndex,

            data: {
                type: 'text',
                config: {
                    text: {
                        allow_multiline: false,
                        default_value: '',
                        placeholder: '',
                    }
                },
            },
        }

        promptDataRef.current.variables.push(newRTVar);
        promptDataRef.current.addedVariables.push(varId);
        promptDataRef.current.changedVariables[newRTVar.id] = newRTVar;

        refresh();
        return newRTVar.id;
    }
    const removeVar = (varId: string) => {
        if (!promptDataRef.current) return;

        const varIndex = promptDataRef.current.variables.findIndex((item) => item.id === varId);
        if (varIndex === -1) return;

        promptDataRef.current.variables.splice(varIndex, 1);

        if (varId in promptDataRef.current.addedVariables) {
            promptDataRef.current.removedVariables = promptDataRef.current.removedVariables.filter(i => i !== varId);
        }
        else {
            promptDataRef.current.removedVariables.push(varId);
        }
        refresh();
    }
    /**
     * 변수 ID 변경
     * 
     * 새 변수를 생성하고 front 범위에서만 임시할당된 ID를 backend에서 받은 실제 ID로 변경할 때 사용
    */
    const changeVarId = (oldVarId: string, newVarId: string) => {
        if (!promptDataRef.current) return;

        const varIndex = promptDataRef.current.variables.findIndex((item) => item.id === oldVarId);
        if (varIndex === -1) return;

        promptDataRef.current.variables[varIndex].id = newVarId;
        if (oldVarId in promptDataRef.current.changedVariables) {
            promptDataRef.current.changedVariables[newVarId] = promptDataRef.current.changedVariables[oldVarId];
            delete promptDataRef.current.changedVariables[oldVarId];
        }
        refresh();
    }

    // 변경 기록 초기화
    const clearChanged = () => {
        if (!promptDataRef.current) return;

        promptDataRef.current.changed = {
            name: false,
            version: false,
            contents: false,
            config: false,
            model: false,
        };
        promptDataRef.current.addedVariables = [];
        promptDataRef.current.changedVariables = {};
        promptDataRef.current.removedVariables = [];
        refresh();
    }
    const reset = (promptData: PromptData) => {
        promptDataRef.current = promptData;

        refresh();
    }

    const setVarName = (varId: string, name: string) => {
        if (!promptDataRef.current) return;

        const duplicatedVar = promptDataRef.current.variables.find((item) => item.id !== varId && item.name === name);
        if (duplicatedVar) {
            throw new Error('변수명이 중복되었습니다.');
        }

        setVar(varId, (prev) => ({
            ...prev,
            name,
        }));
        refresh();
    }
    const setVarFormName = (varId: string, formName: string) => {
        if (!promptDataRef.current) return;

        setVar(varId, (prev) => ({
            ...prev,
            form_name: formName,
        }));
        refresh();

    }
    const setVarData = (varId: string, varData: SetStateAction<RTVarDataNaive>) => {
        if (!promptDataRef.current) return;

        const promptVar = promptDataRef.current.variables.find((item) => item.id === varId);
        if (!promptVar) return;

        const getData = (prev: PromptVar) => {
            if (prev.include_type !== 'form') {
                throw new Error('VarData는 form 타입에서만 설정할 수 있습니다.');
            }
            return prev.data;
        }

        setVar(varId, (prev) => ({
            ...prev,
            data: (
                typeof varData === 'function'
                    ? varData(getData(prev))
                    : varData
            ),
        }));
        refresh();
    }
    const setVarDataType = (
        varId: string,
        configType: RTVarDataNaive['type']
    ) => {
        if (!promptDataRef.current) return;

        const getData = (prev: PromptVar) => {
            if (prev.include_type !== 'form') {
                throw new Error('VarData는 form 타입에서만 설정할 수 있습니다.');
            }
            return prev.data;
        }

        setVar(varId, (prev) => {
            const prevData = getData(prev);

            return {
                ...prev,
                data: {
                    type: configType,
                    config: {
                        [configType]: getDefaultConfig(configType),
                        ...prevData.config,
                    }
                },
            }
        });
        refresh();
    }
    const setVarDataConfig = <T extends RTVarDataNaive['type']>(
        varId: string,
        configType: T,
        config: SetStateAction<NonNullable<RTVarDataNaive['config'][T]>>
    ) => {
        if (!promptDataRef.current) return;

        const getData = (prev: PromptVar) => {
            if (prev.include_type !== 'form') {
                throw new Error('VarData는 form 타입에서만 설정할 수 있습니다.');
            }
            return prev.data;
        }

        setVar(varId, (prev) => {
            const prevData = getData(prev);
            return {
                ...prev,
                data: {
                    ...prevData,
                    config: {
                        ...prevData.config,
                        [configType]: (
                            typeof config === 'function'
                                ? config(prevData.config[configType] ?? {} as any) // @TODO 기본 값 처리
                                : config
                        )
                    }
                },
            }
        });
        refresh();
    };

    const setVarField = (
        varId: string,
        fieldName: string,
        next: SetStateAction<RTVarConfig.StructField>,
    ) => {
        if (!promptDataRef.current) return;

        const promptVar = promptDataRef.current.variables.find((item) => item.id === varId);
        if (!promptVar) throw new ActionFail('');
        if (promptVar.include_type !== 'form') throw new ActionFail('');
        if (promptVar.data.type !== 'struct') throw new ActionFail('');
        if (!promptVar.data.config.struct) throw new ActionFail('');

        const structConfig = promptVar.data.config.struct;
        const fieldIndex = structConfig.fields.findIndex(f => f.name === fieldName);
        if (fieldIndex == -1) throw new ActionFail('');

        structConfig.fields[fieldIndex] = (
            typeof next === 'function'
                ? next(structConfig.fields[fieldIndex])
                : next
        );

        refresh();
    }

    const setVarFieldName = (varId: string, oldName: string, newName: string) => {
        if (!promptDataRef.current) return;

        const promptVar = promptDataRef.current.variables.find((item) => item.id === varId);
        if (!promptVar) throw new ActionFail('');
        if (promptVar.include_type !== 'form') throw new ActionFail('');
        if (promptVar.data.type !== 'struct') throw new ActionFail('');
        if (!promptVar.data.config.struct) throw new ActionFail('');

        const field = promptVar.data.config.struct.fields.find(f => f.name === oldName);
        const duplicated = promptVar.data.config.struct.fields.find(f => f.name === newName);
        if (!field) throw new ActionFail('');
        if (duplicated) throw new ActionFail('');
        field.name = newName;

        refresh();
    }

    const setVarFieldDisplayName = (varId: string, fieldName: string, displayName: string) => {
        setVarField(varId, fieldName, (prev) => ({
            ...prev,
            display_name: displayName,
        }));
    }

    const setVarFieldType = (varId: string, fieldName: string, type: RTVarConfig.StructField['type']) => {
        setVarField(varId, fieldName, (prev) => ({
            ...prev,
            type,
        }));
    }

    const setVarFieldConfig = <T extends RTVarConfig.StructField['type']>(
        varId: string,
        fieldName: string,
        fieldType: T,
        next: SetStateAction<RTVarConfig.StructField['config'][T]>
    ) => {
        setVarField(varId, fieldName, (prev) => {
            if (prev.type !== fieldType) throw new ActionFail('');

            if (typeof next === 'function') {
                next = next(prev.config[fieldType]);
            }

            return {
                ...prev,
                config: {
                    ...prev.config,
                    [fieldType]: next,
                }
            }
        });
    }

    return {
        value: promptData as Readonly<PromptData | null>,
        get: () => {
            if (!promptDataRef.current) throw new Error('Prompt data is not loaded yet.');
            return { ...promptDataRef.current } as Readonly<PromptData>;
        },
        action: {
            setName,
            setVersion,
            setContents,
            setConfig,

            addVar,
            removeVar,
            setVar,
            changeVarId,

            setModelConfig,

            clearChanged,
        },
        varAction: {
            setName: setVarName,
            setFormName: setVarFormName,

            setData: setVarData,
            setDataType: setVarDataType,
            setDataConfig: setVarDataConfig,

            setFieldType: setVarFieldType,
            setFieldName: setVarFieldName,
            setFieldDisplayName: setVarFieldDisplayName,
            setFieldConfig: setVarFieldConfig,
        },
        event: {
            usePromptDataUpdateEvent,
        },
        reset
    }
}