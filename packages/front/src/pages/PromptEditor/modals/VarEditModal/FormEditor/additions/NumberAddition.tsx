import { CheckBoxForm, NumberForm } from '@/components/forms';
import { AdditionProps } from './types';

export function NumberAddition({
    varId,
    varAction,

    config,
    onConfigChange,
}: AdditionProps<'number'>) {
    return (
        <>
            <hr />
            <CheckBoxForm
                name='소수점 허용'
                checked={config.allow_decimal ?? false}
                onChange={(checked) => {
                    onConfigChange((prev) => ({
                        ...prev,
                        allow_decimal: checked,
                    }));
                }}
            />
            <NumberForm
                name='기본값'
                value={config.default_value ?? -1}
                onChange={(value) => {
                    onConfigChange((prev) => ({
                        ...prev,
                        default_value: isNaN(value ?? 0) ? 0 : value,
                    }));
                }}
                allowDecimal={config.allow_decimal ?? false}

                width='10em'
            />
        </>
    );
}

export default NumberAddition;