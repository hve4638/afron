import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, ModalHeader } from '@/features/modal';
import { ConfirmCancelButtons } from 'components/ModalButtons';
import UploadForm from '@/components/FormFields/UploadForm';
import { VertexAIAuth } from '@afron/types';

type StringInputModalProps = {
    title: string;
    aboveDescription?: string;
    belowDescription?: string;
    placeholder?: string;
    onSubmit?: (data: VertexAIAuth) => Promise<boolean> | boolean | undefined | void;
}

function AddVertexAIAPIKeyModal({
    onSubmit = () => { return; },
}: StringInputModalProps) {
    const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');
    const [vertexAIAPI, setVertexAIAPI] = useState<VertexAIAuth>();

    return (
        <Modal
            className='relative'
            style={{
                width: 'auto',
                minWidth: '400px',
            }}
            allowEscapeKey={true}
        >
            <ModalHeader hideCloseButton={true}>VertexAI API 키</ModalHeader>
            <div style={{ height: '0.25em' }} />
            <div style={{ fontSize: '0.9rem' }}>비공개 키 (JSON)</div>
            <div style={{ height: '0.25em' }} />
            <UploadForm
                onUpload={async (files) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const data: any = e.target?.result;
                        try {
                            const obj = JSON.parse(data);
                            const projectid = obj.project_id;
                            const privatekey = obj.private_key;
                            const clientemail = obj.client_email;

                            if (!projectid || !privatekey || !clientemail) {
                                throw new Error('Invalid File');
                            }

                            setVertexAIAPI({
                                project_id: projectid,
                                private_key: privatekey,
                                client_email: clientemail
                            })
                            setStatus('success');
                        }
                        catch (e) {
                            setStatus('fail');
                        }
                    }
                    reader.readAsText(files[0]);
                }}
            />
            {
                status === 'success'
                    ? <small className='green'>파일을 불러왔습니다</small>
                    : status === 'fail'
                        ? <small className='red'>파일을 불러오는데 실패했습니다</small>
                        : <small />
            }
            <div style={{ height: '0.5em' }} />
            <ConfirmCancelButtons
                onConfirm={async () => {
                    if (!vertexAIAPI) return;
                    let result = onSubmit(vertexAIAPI);
                    if (result == undefined) close();

                    if (result && typeof result['then'] === 'function') {
                        result = await result;
                    }
                    if (result || result == undefined) {
                        close();
                    }
                }}
                onCancel={() => close()}
                enableConfirmButton={status === 'success'}
            />
        </Modal>
    )
}

export default AddVertexAIAPIKeyModal;