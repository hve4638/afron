import classNames from 'classnames';
import { Align, Column } from '@/components/layout';
import styles from './styles.module.scss';
import { CommonProps } from '@/types';

interface ListViewProps extends CommonProps {
    children?: React.ReactNode;
    reverse?: boolean;
}

function ListView({
    className='',
    style={},
    reverse = false,
    children
}:ListViewProps) {
    return (
        <Column
            className={classNames(className, styles['list-view'])}
            style={style}
            columnAlign={
                reverse
                    ? Align.End
                    : Align.Start
            }
        >
            {children}
        </Column>
    );
}

export default ListView;