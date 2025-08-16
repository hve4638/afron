import classNames from 'classnames';
import styles from './ui.module.scss';
import { useState } from 'react';
import { CommonProps } from '@/types';
import { useCacheStore, useSessionStore } from '@/stores';

interface TokenCountProps extends CommonProps {

}

function TokenCount({
    className = '',
    style = {},
}: TokenCountProps) {
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