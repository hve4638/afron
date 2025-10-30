import { useTranslation } from 'react-i18next';
import { CheckBoxForm, StringForm, StringLongForm } from '@/components/forms';
import { TextAreaInput } from '@/components/Input';
import { RTVarConfig, RTVarForm } from '@afron/types';
import { AdditionsProps } from './types';

export function TextAddition({
    target,
    varId,
    varAction,
}: AdditionsProps) {
    const { t } = useTranslation();

    const textConfig = target.data.config.text!;
    const setConfig = (callback: Parameters<typeof varAction.setDataConfig<'text'>>[2]) => varAction.setDataConfig(varId, 'text', callback);

    return (
        <>
            <hr />
            <CheckBoxForm
                name={t('form_editor.text_config.allow_multiline_label')}
                checked={textConfig.allow_multiline ?? false}
                onChange={(checked) => {
                    setConfig((prev) => ({
                        ...prev,
                        allow_multiline: checked,
                    }));
                }}
            />
            <StringForm
                name={t('form_editor.text_config.placeholder_label')}
                value={textConfig.placeholder ?? ''}
                onChange={(value) => {
                    setConfig((prev) => ({
                        ...prev,
                        placeholder: value,
                    }));
                }}
                width='10em'
            />
            {
                textConfig.allow_multiline
                    ? <>
                        <div
                            style={{
                                marginBottom: '0.25em',
                            }}
                        >{t('form_editor.default_value_label')}</div>
                        <TextAreaInput
                            value={textConfig.default_value ?? ''}
                            onChange={(value) => {
                                setConfig((prev) => ({
                                    ...prev,
                                    default_value: value,
                                }));
                            }}
                        >

                        </TextAreaInput>
                    </>
                    : <StringForm
                        name={t('form_editor.default_value_label')}
                        value={textConfig.default_value ?? ''}
                        onChange={(value) => {
                            setConfig((prev) => ({
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