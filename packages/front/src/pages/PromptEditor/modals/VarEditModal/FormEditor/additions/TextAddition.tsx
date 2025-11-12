import { useTranslation } from 'react-i18next';
import { CheckBoxForm, StringForm, StringLongForm } from '@/components/FormFields';
import { TextAreaInput } from '@/components/Input';
import { RTVarConfig, RTVarForm } from '@afron/types';
import { AdditionProps } from './types';

export function TextAddition({
    varId,
    varAction,

    config,
    onConfigChange,
}: AdditionProps<'text'>) {
    const { t } = useTranslation();
    // const setConfig = (callback: Parameters<typeof varAction.setDataConfig<'text'>>[2]) => varAction.setDataConfig(varId, 'text', callback);

    return (
        <>
            <hr />
            <CheckBoxForm
                name={t('form_editor.text_config.allow_multiline_label')}
                checked={config.allow_multiline ?? false}
                onChange={(checked) => {
                    onConfigChange((prev) => ({
                        ...prev,
                        allow_multiline: checked,
                    }));
                }}
            />
            <StringForm
                name={t('form_editor.text_config.placeholder_label')}
                value={config.placeholder ?? ''}
                onChange={(value) => {
                    onConfigChange((prev) => ({
                        ...prev,
                        placeholder: value,
                    }));
                }}
                width='10em'
            />
            {
                config.allow_multiline
                    ? <>
                        <div
                            style={{
                                marginBottom: '0.25em',
                            }}
                        >{t('form_editor.default_value_label')}</div>
                        <TextAreaInput
                            value={config.default_value ?? ''}
                            onChange={(value) => {
                                onConfigChange((prev) => ({
                                    ...prev,
                                    default_value: value,
                                }));
                            }}
                        >

                        </TextAreaInput>
                    </>
                    : <StringForm
                        name={t('form_editor.default_value_label')}
                        value={config.default_value ?? ''}
                        onChange={(value) => {
                            onConfigChange((prev) => ({
                                ...prev,
                                default_value: value,
                            }));
                        }}
                        width='10em'
                    />
            }
        </>
    );
}

export default TextAddition;