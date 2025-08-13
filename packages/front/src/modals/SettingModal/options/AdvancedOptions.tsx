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
                checked={configs.prompt_preview_enabled}
                onChange={(checked)=> configs.update.prompt_preview_enabled(checked)}
            />
            <CheckBoxForm
                label='전역 모델 설정 활성화'
                checked={configs.global_model_config_enabled}
                onChange={(checked)=> configs.update.global_model_config_enabled(checked)}
            />
            <CheckBoxForm
                label='입력창에 토큰 수 표시'
                checked={configs.show_token_count}
                onChange={(checked)=> configs.update.show_token_count(checked)}
            />
        </Column>
    )
}

export default AdvancedOptions;