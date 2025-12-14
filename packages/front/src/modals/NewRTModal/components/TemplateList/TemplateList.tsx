import classNames from 'classnames';

import { Column } from '@/components/layout';
import { ReactNodeProps } from '@/types';

import { TemplateItem } from './TemplateItem';

import styles from './styles.module.scss';

interface TemplateListProps extends ReactNodeProps.Common {
    children?: React.ReactNode;
}

export function TemplateList({ className, style, children }: TemplateListProps) {
    return (
        <Column
            className={classNames(styles['rt-template-list'], 'undraggable', className)}
            style={style}
        >
            {children}
        </Column>
    );
}

TemplateList.Item = TemplateItem;