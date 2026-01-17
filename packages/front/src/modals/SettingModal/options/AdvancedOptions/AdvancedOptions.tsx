import { useConfigStore } from '@/stores';
import { CheckBoxForm, Field } from '@/components/FormFields';
import { Column, Gap } from '@/components/layout';

import styles from './styles.module.scss';
import { useAdvancedOptions } from './AdvancedOptions.hooks';
import { Delimiter } from '@/components/atoms';
import Description from '@/components/atoms/Description';

export function AdvancedOptions() {
    const { state, update } = useAdvancedOptions();

    return (
        <Column className={styles['options-gap']}>
            <Field.CheckBox
                label='프롬프트 미리보기 버튼 활성화'
                checked={state.promptPreviewEnabled}
                onChange={(checked) => update.promptPreviewEnabled(checked)}
            />
            <Field.CheckBox
                label='전역 모델 설정 활성화'
                checked={state.globalModelConfigEnabled}
                onChange={(checked) => update.globalModelConfigEnabled(checked)}
            />
            <Field.CheckBox
                label='입력창에 토큰 수 표시'
                checked={state.showTokenCount}
                onChange={(checked) => update.showTokenCount(checked)}
            />

            <Gap h='0.5em' />
            <Delimiter />
            <Gap h='0.5em' />

            <Field.CheckBox
                label='하드웨어 가속 사용'
                
                checked={state.hardwareAccelerationEnabled ?? false}
                onChange={(checked) => {
                    if (state.hardwareAccelerationEnabled == null) return;

                    update.hardwareAccelerationEnabled(checked)
                }}
            />
            <Description>
                화면 깜빡임, 깨짐 발생 시 이 옵션을 끄고 재시작하세요
            </Description>
        </Column>
    )
}

export default AdvancedOptions;