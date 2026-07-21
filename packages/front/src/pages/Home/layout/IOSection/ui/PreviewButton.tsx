import classNames from 'classnames';

import { GIconButton } from '@/components/atoms/GoogleFontIcon';
import { requestBus } from '@/events/request';

import styles from './ui.module.scss';

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
                requestBus.emit.send_preview_request();
            }}
        />
    )
}

export default PreviewButton;