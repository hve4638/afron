import classNames from 'classnames';
import { GIconButton } from '@/components/atoms/GoogleFontIcon';
import { CommonProps } from '@/types';

import styles from './MarkdownButton.module.scss'

interface MarkdownButtonProps extends CommonProps {
    value: boolean;
    onChange: (next: boolean) => void;
}

function MarkdownButton({
    className,
    style,
    value,
    onChange,
}: MarkdownButtonProps) {
    return (

        <GIconButton
            className={
                classNames(
                    { [styles['markdown-enabled']]: value },
                    className,
                )
            }
            style={{
                ...style,
                fontSize: '1.15em',
            }}
            value='markdown'
            hoverEffect='square'
            onClick={() => onChange(!value)}
        />
    );
}

export default MarkdownButton;