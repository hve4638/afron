import { useEffect, useRef, useState } from 'react';
import { Modal } from '@/features/modal';
import { Align, Column, Flex, Row } from 'components/layout';
import Button from '@/components/atoms/Button';
import { TextInput } from 'components/Input';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { useModalInstance } from '@/features/modal';

function NewProfileModal({
    onSubmit,
}: {
    onSubmit: (metadata) => void
}) {
    const { closeModal } = useModalInstance();
    const [name, setName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Modal
            header={{
                label: '프로필 추가',
                showCloseButton: true,
            }}
            allowEscapeKey={true}
        >
            <Row
                rowAlign={Align.Center}
                style={{
                    width: '100%',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    boxSizing: 'border-box',
                    marginBottom: '8px'
                }}
            >
                <div
                    className='noflex'
                    style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: 'lightgray',
                        borderRadius: '8px'
                    }}
                ></div>
                <Flex
                    className='center'
                    style={{
                        height: '64px',
                        paddingLeft: '16px'
                    }}
                >
                    <TextInput
                        ref={inputRef}
                        className={classNames('wfill', styles['profile-input'])}
                        placeholder='프로필 이름'
                        style={{
                            boxSizing: 'content-box',
                            padding: '2px 0.5em',
                            height: '1.5em'
                        }}
                        value={name}
                        onChange={(value) => {
                            setName(value);
                        }}
                        instantChange={true}
                    />
                </Flex>
            </Row>
            <div style={{ height: '16px' }} />
            <Row
                rowAlign={Align.End}
                style={{
                    width: '100%',
                    height: '32px',
                    gap: '12px',
                }}
            >
                <Button
                    className='green'
                    style={{
                        width: '128px',
                        height: '100%'
                    }}
                    onClick={() => {
                        if (name === '') return;

                        const metadata = {
                            name: name,
                            color: 'lightgray'
                        }
                        onSubmit(metadata);
                        closeModal();
                    }}
                    disabled={name.length === 0}
                >생성</Button>
                <Button
                    className='transparent'
                    style={{
                        width: '128px',
                        height: '100%'
                    }}
                    onClick={closeModal}
                >취소</Button>
            </Row>
        </Modal>
    )
}

export default NewProfileModal;