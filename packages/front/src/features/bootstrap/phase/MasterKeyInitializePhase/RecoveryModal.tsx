import { useMemo, useState } from 'react';
import classNames from 'classnames';
import ReactLoading from 'react-loading';

import { Align, Row } from '@/components/layout';
import Button from '@/components/atoms/Button';
import { ConfirmModal } from '@/features/modal';

import styles from './styles.module.scss';
import { ModalLegacy } from './legacy/Modal';
import useModalDisappear from '@/hooks/useModalDisappear';

interface RecoveryModalProps {
    onReset: () => void;
    onRecovery: (recoveryKey:string) => Promise<boolean>;
    onClose: () => void;
}

function RecoveryModal({
    onReset,
    onRecovery,
    onClose,
}:RecoveryModalProps) {
    const [loading, setLoading] = useState(false);
    const [recoveryKey, setRecoveryKey] = useState('');
    const valid = useMemo(()=>recoveryKey.length >= 4, [recoveryKey]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [disappear, closeModal] = useModalDisappear(onClose);

    return (
        <ModalLegacy
            className='relative'
            style={{
                width : 'auto',
                minWidth: '400px',
            }}
            headerLabel='showCloseButton'
            disappear={disappear}
        >
            <Row
                style={{
                    height: '1.4em',
                    margin: '0.5em 0.5em'
                }}
            >
                <span
                    className='noflex undraggable'
                    style={{
                        marginRight: '1em'
                    }}
                >
                    복구 키
                </span>
                <input
                    type='text'
                    className='input-number flex'
                    value={recoveryKey}
                    onChange={(e)=>setRecoveryKey(e.target.value)}
                />
            </Row>
            <div className={classNames(styles['description'], 'undraggable')}>
                <div>복구키를 이용해 API 키 등의 민감 데이터를 보존할 수 있습니다</div>
                <div>초기화 시에도 프로필, 프롬프트 등의 데이터는 보존됩니다</div>
                <div
                    className={styles['error']}
                    style={{
                        height : '1em',
                    }}
                >
                    {errorMessage}
                </div>
            </div>
            <Row
                style={{
                    height: '1.4em',
                    margin: '0.5em 0.5em'
                }}
                rowAlign={Align.End}
            >
                
                {
                    loading &&
                    <div
                        style={{
                            margin: 'auto 0px',
                            width: '2em',
                        }}
                    >
                        <ReactLoading
                            type={"spinningBubbles"}
                            height={'1em'}
                        />
                    </div>
                }
                <Button
                    className={
                        classNames(
                            'green',
                            {disabled: !valid || loading}
                        )
                    }
                    style={{
                        width: '96px',
                        height: '100%',
                    }}
                    onClick={async ()=>{
                        if (!valid || loading) return;
                        setLoading(true);

                        try {
                            const success = await onRecovery(recoveryKey);
                            if (success) {
                                setErrorMessage('');
                                onClose();
                            }
                            else{
                                setErrorMessage('복구할 수 없습니다.');
                            }
                        }
                        finally {
                            setLoading(false);
                        }
                    }}
                >복구</Button>
                <div style={{width:'8px'}}/>
                <Button
                    className={
                        classNames(
                            'red',
                            {disabled: loading}
                        )
                    }
                    style={{
                        width: '96px',
                        height: '100%',
                    }}
                    onClick={()=>{
                        setShowConfirmModal(true);
                    }}
                >초기화</Button>
            </Row>
            {
                showConfirmModal &&
                <ConfirmModal
                    style={{
                        minWidth: '350px',
                        width: 'auto',
                    }}
                    title='키 초기화'
                    onConfirm={()=>{
                        onReset();
                        onClose();
                        return true;
                    }}
                    onClosed={()=>{
                        setShowConfirmModal(false);
                    }}
                >
                    <div>정말로 초기화하겠습니까?</div>
                </ConfirmModal>
            }
        </ModalLegacy>
    )
}

export default RecoveryModal;