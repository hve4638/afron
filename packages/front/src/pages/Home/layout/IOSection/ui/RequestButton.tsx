import classNames from 'classnames';

import { GIconButton } from '@/components/GoogleFontIcon';
import { emitEvent } from '@/hooks/useEvent';
import { useSessionStore } from '@/stores';

import styles from './ui.module.scss';

function RequestButton() {
    const sessionState = useSessionStore();
    
    return (
        <GIconButton
            className={classNames(styles['input-section-button'])}
            value={sessionState.state === 'idle' ? 'send' : 'stop'}
            style={{
                cursor: 'pointer',
                fontSize: '32px',
                width: '40px',
                height: '40px',
            }}
            onClick={() => {
                emitEvent('send_request');
            }}
        />
    )
}

export default RequestButton;