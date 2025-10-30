import { RTVarConfig } from '@afron/types';
import { CheckBoxForm } from '@/components/forms';
import { AdditionsProps } from './types';

export function CheckboxAddition({
    target,
    varId,
    varAction
}: AdditionsProps) {
    const checkboxConfig = target.data.config.checkbox!;
    const setConfig = (callback: Parameters<typeof varAction.setDataConfig<'checkbox'>>[2]) => varAction.setDataConfig(varId, 'checkbox', callback);

    return (
        <>
            <hr />
            <CheckBoxForm
                name='기본값'
                checked={checkboxConfig.default_value ?? false}
                onChange={(checked) => {
                    setConfig((prev) => ({
                        ...prev,
                        default_value: checked,
                    }));
                }}
            />
        </>
    );
}

export default CheckboxAddition;