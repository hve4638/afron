import classNames from 'classnames';
import styles from './HoverEffect.module.scss';

type HoverEffectProps = {
    className?: string;
    style?: React.CSSProperties;
    enabled?: boolean;
}

function HoverEffect({
    className = '',
    style = {},
    enabled = false,
}: HoverEffectProps) {
    return (
        <div
            className={
                classNames(
                    styles['hover-effect'],
                    className,
                    { [styles['enabled']]: enabled },
                )
            }
            style={style}
        />
    );
}

export default HoverEffect;