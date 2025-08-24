import Button from '@/components/Button';
import { Align, Row } from '@/components/layout';
import { Modal, ModalHeader, ModalRequiredProps } from '@/components/Modal';
import { t } from 'i18next';

interface RTExportModalProps extends ModalRequiredProps {
}

function RTExportModal({
    isFocused,
    onClose
}: RTExportModalProps) {
    return (
        <Modal
            headerLabel={
                <ModalHeader>
                    요청 템플릿 내보내기
                </ModalHeader>
            }
        >
            <Row
                rowAlign={Align.End}
                style={{
                    height: '100%',
                    gap: '0.5em',
                }}
            >
                <Button
                    onClick={() => {

                        close();
                    }}
                    style={{
                        minWidth: '80px',
                        height: '100%'
                    }}
                >내보내기</Button>
            </Row>
        </Modal>
    )
}

export default RTExportModal;