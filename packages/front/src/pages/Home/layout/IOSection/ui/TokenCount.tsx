import classNames from 'classnames';

import { ReactNodeProps } from '@/types';
import { useSessionStore } from '@/stores';

import styles from './ui.module.scss';

function TokenCount({
    className = '',
    style = {},
}: ReactNodeProps.Common) {
    const tokenCount = useSessionStore(state=>state.input_token_count);

    return (
        <small
            className={
                classNames(
                    styles['token-count'],
                    'secondary-color',
                    'undraggable',
                    className,
                )}
            style={{
                ...style,
                pointerEvents: 'none',
            }}
        >token: {tokenCount}</small>
    );
}

export default TokenCount;