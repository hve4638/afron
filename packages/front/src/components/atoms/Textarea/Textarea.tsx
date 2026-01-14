import { CommonProps } from '@/types';
import styles from './Textarea.module.scss';
import classNames from 'classnames';

interface TextareaProps extends CommonProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function Textarea({
    className,
    style,
    value,
    onChange,
}: TextareaProps) {
    return (
        <textarea
            className={
                classNames(styles['textarea'], className)
            }
            style={{...style}}

            value={value}
            onChange={onChange}
        />
    );
}