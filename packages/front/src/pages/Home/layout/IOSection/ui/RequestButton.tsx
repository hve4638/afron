import classNames from 'classnames';

import { GIconButton } from '@/components/atoms/GoogleFontIcon';
import { useSessionState } from '@/features/profile-event/hooks/useSessionState';
import { emitEvent } from '@/hooks/useEvent';

import styles from './ui.module.scss';

function RequestButton() {
    const sessionState = useSessionState();
    const isIdle = sessionState === 'idle';

    return (
        <GIconButton
            className={classNames(styles['input-section-button'])}
            value={isIdle ? 'send' : 'stop'}
            style={{
                cursor: 'pointer',
                fontSize: '32px',
                width: '40px',
                height: '40px',
            }}
            onClick={() => {
                if (isIdle) {
                    emitEvent('send_request');
                }
                
            }}
        />
    )
}

export default RequestButton;