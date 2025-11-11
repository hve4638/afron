import Button from '@/components/atoms/Button';
import { CheckBoxForm } from '@/components/FormFields';
import { Column, Row } from '@/components/layout';
import { Modal, ModalHeader } from '@/components/Modal';
import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';
import { useGlobalConfigStore } from '@/stores';

function GlobalSettingModal({
    onClose,
}: {
    onClose: () => void;
}) {
    const globalConfigState = useGlobalConfigStore();
    const [disappear, close] = useModalDisappear(onClose);
    
    return (
        <Modal
            disappear={disappear}

            onEscapeAction={close}
            focused={true}

            headerLabel={
                <ModalHeader onClose={close}>설정</ModalHeader>
            }
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