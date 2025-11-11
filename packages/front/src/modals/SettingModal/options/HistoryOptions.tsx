import { useConfigStore } from '@/stores';
import { CheckBoxForm, DropdownForm, NumberForm } from '@/components/FormFields';
import { Column } from '@/components/layout';

import styles from '../styles.module.scss';

function HistoryOptions() {
    const configs = useConfigStore();

    return (
        <Column className={styles['options-gap']}>
            <CheckBoxForm
                name='기록 활성화'
                checked={configs.history_enabled}
                onChange={configs.update.history_enabled}
            />
            <NumberForm
                name='세션 당 최대 저장 기록 수'
                width='6em'
                value={configs.max_history_limit_per_session}
                onChange={(x) => (x != null && configs.update.max_history_limit_per_session(x))}
            />
            <DropdownForm
                label='최대 저장 일수'
                value={String(configs.max_history_storage_days)}
                onChange={(next) => configs.update.max_history_storage_days(Number(next))}
            >
                <DropdownForm.Item name='무제한' value='0'/>
                <DropdownForm.Item name='1일' value='1'/>
                <DropdownForm.Item name='1주' value='7'/>
                <DropdownForm.Item name='1개월' value='30'/>
                <DropdownForm.Item name='3개월' value='90'/>
                <DropdownForm.Item name='6개월' value='180'/>
                <DropdownForm.Item name='1년' value='365'/>
            </DropdownForm>
        </Column>
    )
}

export default HistoryOptions;