import classNames from 'classnames';

import { GIconButton } from '@/components/GoogleFontIcon';
import { emitEvent } from '@/hooks/useEvent';

import styles from './styles.module.scss';

function PreviewButton() {
    return (
        <GIconButton
            className={classNames(styles['input-section-button'])}
            value='visibility'
            style={{
                cursor: 'pointer',
                fontSize: '32px',
                width: '40px',
                height: '40px',
            }}
            onClick={() => {
                emitEvent('send_preview_request');
            }}
        />
    )
}

export default PreviewButton;