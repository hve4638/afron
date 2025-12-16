import { CheckBoxForm } from '@/components/FormFields';
import { Column, Gap } from '@/components/layout';
import { Modal } from '@/features/modal';
import { useGlobalConfigStore } from '@/stores';

export function GlobalSettingModal() {
    const globalConfigState = useGlobalConfigStore();

    return (
        <Modal
            allowEscapeKey={true}
            header={{
                label: '설정',
                showCloseButton: true,
            }}
        >
            <Column>
                <CheckBoxForm
                    name='공유 모드'
                    checked={globalConfigState.shared_mode}
                    onChange={(checked) => {
                        globalConfigState.update.shared_mode(checked);
                    }}
                />
                <small className='secondary-color' style={{ marginLeft: '0.15em' }}>활성화 시 다른 PC에서 복구 키로 복원 시에도 기존 PC를 기억합니다.</small>
                {/* <Gap h='1em'/>
                <CheckBoxForm
                    name='하드웨어 가속 사용'
                    checked={globalConfigState.hardware_acceleration}
                    onChange={(checked) => {
                        globalConfigState.update.hardware_acceleration(checked);
                    }}
                />
                <small className='secondary-color' style={{ marginLeft: '0.15em' }}>화면이 깜빡임이나 렌더링 오류 발생 시 비활성화하세요. 재시작 후 적용됩니다.</small> */}
            </Column>
        </Modal>
    )
}

export default GlobalSettingModal;