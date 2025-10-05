import { CommonProps } from '@/types';
import styles from './Textarea.module.scss';
import classNames from 'classnames';

interface TextareaProps extends CommonProps {

}

export function Textarea({
    className,
    style,
}: TextareaProps) {
    return (
        <textarea
            className={
                classNames(styles['textarea'], className)
            }
            style={{...style}}

            
        />
    );
}