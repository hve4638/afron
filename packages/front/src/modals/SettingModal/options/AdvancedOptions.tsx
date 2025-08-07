import { useConfigStore } from '@/stores';
import { CheckBoxForm, DropdownForm, NumberForm } from '@/components/Forms';
import { Column } from '@/components/layout';

import styles from '../styles.module.scss';

function AdvancedOptions() {
    const configs = useConfigStore();

    return (
        <Column className={styles['options-gap']}>
            <CheckBoxForm
                label='프롬프트 미리보기 버튼 활성화'
                checked={configs.enabled_prompt_preview}
                onChange={(checked)=> configs.update.enabled_prompt_preview(checked)}
            />
        </Column>
    )
}

export default AdvancedOptions;