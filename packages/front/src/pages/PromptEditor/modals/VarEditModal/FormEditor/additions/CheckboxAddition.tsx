import { CheckBoxForm } from '@/components/FormFields';
import { AdditionProps } from './types';

export function CheckboxAddition({
    varId,
    varAction,

    config,
    onConfigChange,
}: AdditionProps<'checkbox'>) {
    const setConfig = (callback: Parameters<typeof varAction.setDataConfig<'checkbox'>>[2]) => varAction.setDataConfig(varId, 'checkbox', callback);

    return (
        <>
            <hr />
            <CheckBoxForm
                name='기본값'
                checked={config.default_value ?? false}
                onChange={(checked) => {
                    onConfigChange((prev) => ({
                        ...prev,
                        default_value: checked,
                    }));
                }}
            />
        </>
    );
}

export default CheckboxAddition;