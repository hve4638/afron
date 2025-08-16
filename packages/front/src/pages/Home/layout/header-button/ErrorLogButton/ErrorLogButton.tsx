import { GIconButton } from '@/components/GoogleFontIcon';

import { emitEvent } from '@/hooks/useEvent';

import useErrorLogStore from '@/stores/useErrorLogStore';

import styles from './styles.module.scss';


function ErrorLogButton() {
    const { log, hasUnread } = useErrorLogStore();

    if (log.length === 0) {
        return <></>;
    }
    else {
        return (
            <GIconButton
                value='error'
                style={{
                    height: '100%',
                    aspectRatio: '1/1',
                    fontSize: '2em',
                }}
                hoverEffect='circle'
                onClick={() => {
                    emitEvent('open_error_log', null);
                }}
            >
                {
                    hasUnread &&
                    <span
                        className={styles['red-circle']}
                        style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                        }}
                    />
                }
            </GIconButton>
        )
    }
}

export default ErrorLogButton;