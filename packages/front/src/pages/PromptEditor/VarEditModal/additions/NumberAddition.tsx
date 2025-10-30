import { useTranslation } from 'react-i18next';
import { CheckBoxForm, NumberForm } from '@/components/forms';
import { RTVarConfig } from '@afron/types';
import { AdditionsProps } from './types';

export function NumberAddition({
    target,
    varId,
    varAction
}: AdditionsProps) {
    const { t } = useTranslation();

    const numberConfig = target.data.config.number!;
    const setConfig = (callback: Parameters<typeof varAction.setDataConfig<'number'>>[2]) => varAction.setDataConfig(varId, 'number', callback);

    return (
        <>
            <hr />
            <CheckBoxForm
                name='소수점 허용'
                checked={numberConfig.allow_decimal ?? false}
                onChange={(checked) => {
                    setConfig((prev) => ({
                        ...prev,
                        allow_decimal: checked,
                    }));
                }}
            />
            <NumberForm
                name='기본값'
                value={numberConfig.default_value ?? -1}
                onChange={(value) => {
                    setConfig((prev) => ({
                        ...prev,
                        default_value: isNaN(value ?? 0) ? 0 : value,
                    }));
                }}
                allowDecimal={numberConfig.allow_decimal ?? false}

                width='10em'
            />
        </>
    );
}

export default NumberAddition;