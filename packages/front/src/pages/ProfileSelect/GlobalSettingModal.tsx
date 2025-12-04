import { CheckBoxForm } from '@/components/FormFields';
import { Column, Row } from '@/components/layout';
import { Modal, ModalHeader } from '@/features/modal';
import { useGlobalConfigStore } from '@/stores';

function GlobalSettingModal() {
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
                <small className='secondary-color' style={{ marginLeft: '0.15em' }}>활성화 시 다른 PC에서 복구 키로 복원 시에도 기존 PC를 기억합니다</small>
            </Column>
        </Modal>
    )
}

export default GlobalSettingModal;