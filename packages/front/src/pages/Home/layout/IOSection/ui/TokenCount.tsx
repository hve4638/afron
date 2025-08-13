// import { useSessionStore } from '@/stores';
import classNames from 'classnames';
import styles from './ui.module.scss';
import { useState } from 'react';

function TokenCount() {
    const [tokenCount, setTokenCount] = useState(0);

    return (
        <small
            className={classNames(styles['token-count'], 'secondary-color', 'undraggable')}
            style={{
                position: 'absolute',
                left: '0',
                bottom: '0',
                height: 'calc(70px + 1em)',
                padding: '10px',
                pointerEvents: 'none',
            }}
        >token: {tokenCount}</small>
    );
}

export default TokenCount;