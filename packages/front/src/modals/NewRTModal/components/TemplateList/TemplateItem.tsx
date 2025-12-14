import { GIcon } from '@/components/atoms';
import { Align, Column, Row } from '@/components/layout';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { TemplateItemData } from './types';

interface TemplateItemProps {
    value: TemplateItemData;
    onClick: (value: TemplateItemData) => void;
    selected?: boolean;
}

export function TemplateItem({ value, selected, onClick }: TemplateItemProps) {
    const { title, description, icon } = value;
    return (
        <Row
            className={classNames(styles['rt-template-item'], { [styles['selected']]: selected })}
            columnAlign={Align.Center}
            onClick={() => onClick(value)}
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
                <span>{title}</span>
                <small className='secondary-color' style={{ paddingLeft: '0.25em' }}>{description}</small>
            </Column>

        </Row>
    )
}