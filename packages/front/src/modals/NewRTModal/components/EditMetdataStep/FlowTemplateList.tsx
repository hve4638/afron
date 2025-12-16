import classNames from 'classnames';
import { Align, Column, Grid, Row } from '@/components/layout';

import styles from './styles.module.scss';
import { GIcon } from '@/components/atoms/GoogleFontIcon';
import { TemplateList } from '../TemplateList';

type POTemplateListProps = {
    value: string;
    onChange: (value: string) => void;
}

export function FlowTemplateList({
    value,
    onChange,
}: POTemplateListProps) {
    const templates = [
        {
            title: '빈 템플릿',
            icon: 'draft',
            description: '미리 정의되지 않은 빈 템플릿 생성',
            value: 'empty',
        },
        {
            title: '단일 요청',
            icon: 'description',
            description: '기본 요청과 응답 템플릿',
            value: 'normal',
        },
    ]

    return (
        <Grid
            rows='2em 1fr'
            columns='1fr'
        >
            <Row className='undraggable'>
                <div>템플릿</div>
            </Row>
            <TemplateList
                style={{
                    width: '100%',
                    height: '12em',
                    overflowY: 'auto',
                }}
            >
                {
                    templates.map((template) => (
                        <TemplateList.Item
                            value={template}
                            onClick={() => onChange(template.value)}
                            selected={value === template.value}
                        />
                    ))
                }
            </TemplateList>
        </Grid>
    )
}

type TemplateDivProps = {
    title?: string;
    description: string;
    icon: string;
    selected?: boolean;
    onClick: (value:string) => void
    value: string;
}

function TemplateDiv({ title, description, icon, selected, onClick, value }:TemplateDivProps) {
    return (
        <Row
            className={classNames(styles['rt-template'], { [styles['selected']]: selected })}
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