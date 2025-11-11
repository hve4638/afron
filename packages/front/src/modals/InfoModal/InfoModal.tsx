import { Column } from '@/components/layout';
import { Modal, ModalHeader } from '@/components/Modal';
import Well from '@/components/atoms/Well';
import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';

type InfoModalProps = {
    isFocused: boolean;
    onClose: () => void;

    item: Array<{ name?: string; value: string; }>;
}

function InfoModal({
    isFocused,
    onClose,
    item
}: InfoModalProps) {
    const [disappear, close] = useModalDisappear(onClose);

    useHotkey({
        'Escape': () => {
            close();
        }
    }, isFocused, []);
    
    return (
        <Modal
            disappear={disappear}
            style={{
                maxHeight: '80%',
                overflowY: 'auto',
            }}
            headerLabel={
                <ModalHeader
                    onClose={close}
                >정보</ModalHeader>
            }
        >
            {
                item.map((data, i) => {
                    console.log(item);
                    return (
                        <Column
                            key={i}
                            style={{

                            }}
                        >
                            <strong>{data.name}</strong>
                            <Well
                                style={{
                                    whiteSpace: 'pre',
                                    // fontSize: '0.75em',
                                }}
                            >
                                <small>{data.value}</small>
                            </Well>

                        </Column>
                    );
                })
            }
            {/* <ModalHeader ="정보" onClose={() => {}} /> */}
            {/* {item.toString()} */}
        </Modal>
    );
}

export default InfoModal;