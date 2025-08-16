import classNames from 'classnames';
import Latch from '@/lib/Latch';

import { emitEvent } from '@/hooks/useEvent';
import type { CommonProps } from '@/types';

import styles from './styles.module.scss';

interface FileDropperProps extends CommonProps {
    onDragEnd?: () => void;
}

function FileDropper({
    className = '',
    style = {},
    onDragEnd = () => { }
}: FileDropperProps) {
    return <div
        className={classNames(styles['drag-over-form'], 'undraggable', className)}
        style={style}
        onDragLeave={() => {
            onDragEnd();
        }}
        onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}
        onDrop={async (e) => {
            onDragEnd();
            e.preventDefault();
            e.stopPropagation();

            const files = e.dataTransfer.files;
            if (!files || files.length === 0) return;

            for (const file of files) {
                const latch = new Latch();
                emitEvent('input_file_upload', {
                    file: file,
                    latch
                });
                await latch.wait();
            }
        }}
    />
}

export default FileDropper;