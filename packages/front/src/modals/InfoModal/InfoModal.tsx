import { Column } from '@/components/layout';
import { Modal } from '@/features/modal';
import { Well } from '@/components/atoms';
import { useModalInstance } from '@/features/modal';

type InfoModalProps = {
    item: Array<{ name?: string; value: string; }>;
}

function InfoModal({
    item
}: InfoModalProps) {
    const { useCloseKeyBind } = useModalInstance();

    useCloseKeyBind();

    return (
        <Modal
            style={{
                maxHeight: '80%',
                overflowY: 'auto',
            }}
            header={{
                label: '정보',
                showCloseButton: true,
            }}
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
                                    padding: '0em 0.25em',
                                    // fontSize: '0.75em',
                                }}
                            >
                                <small>{data.value}</small>
                            </Well>

                        </Column>
                    );
                })
            }
        </Modal>
    );
}

export default InfoModal;