import classNames from 'classnames';

import { Column } from '@/components/layout';
import { ReactNodeProps } from '@/types';

import { TemplateItem } from './TemplateItem';

import { Well } from '@/components/atoms';

interface TemplateListProps extends ReactNodeProps.Common {
    children?: React.ReactNode;
}

export function TemplateListView({ className, style, children }: TemplateListProps) {
    return (
        <Well
            className={classNames(className)}
            style={style}
        >
            <Column className='wfill'>
                {children}
            </Column>
        </Well>
    );
}

TemplateListView.Item = TemplateItem;