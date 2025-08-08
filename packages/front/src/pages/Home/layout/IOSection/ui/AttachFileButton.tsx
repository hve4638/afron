import { useRef } from 'react';
import classNames from 'classnames';

import { GIconButton } from '@/components/GoogleFontIcon';

import styles from './ui.module.scss';
import Latch from '@/lib/Latch';
import { emitEvent } from '@/hooks/useEvent';

function AttachFileButton() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        for (const file of files) {
            const latch = new Latch();
            emitEvent('input_file_upload', {
                file: file,
                latch
            });
            await latch.wait();
        }
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type='file'
                style={{ display: 'none', pointerEvents: 'none' }}
                onChange={handleFileChange}
            />
            <GIconButton
                className={classNames(styles['input-section-button'])}
                value='attach_file'
                style={{
                    cursor: 'pointer',
                    fontSize: '32px',
                    width: '40px',
                    height: '40px',
                }}
                onClick={() => {
                    fileInputRef.current?.click();
                }}
            >
            </GIconButton>
        </>
    )
}

export default AttachFileButton;