import classNames from 'classnames';

import { GIconButton } from '@/components/GoogleFontIcon';

import styles from './ui.module.scss';

function AttachFileButton() {
    return (
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
                // emitEvent('send_preview_request');
            }}
        />
    )
}

export default AttachFileButton;