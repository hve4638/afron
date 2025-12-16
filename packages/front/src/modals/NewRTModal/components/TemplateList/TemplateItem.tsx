import classNames from 'classnames';

import { GIcon, Well } from '@/components/atoms';
import { Align, Column, Row } from '@/components/layout';

import { TemplateItemData } from './types';

import styles from './styles.module.scss';

interface TemplateItemProps {
    value: TemplateItemData;
    onClick: (value: TemplateItemData) => void;
    selected?: boolean;
}

export function TemplateItem({ value, selected, onClick }: TemplateItemProps) {
    const { title, description, icon } = value;
    return (
        <Well.Item
            className={classNames(styles['rt-template-item'])}
            hoverable
            selected={selected}
            onClick={() => onClick(value)}
        >
            <Row
                columnAlign={Align.Center}
            >
                <GIcon
                    value={icon}
                    style={{
                        aspectRatio: '1 / 1',
                        height: '100%',
                        fontSize: '1.5em',
                    }}
                />
                <Column>
                    <span className='title undraggable'>{title}</span>
                    <small className='description undraggable' style={{ paddingLeft: '0.25em' }}>{description}</small>
                </Column>

            </Row>
        </Well.Item>
    )
}