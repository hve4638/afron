import { Textarea } from '@/components/ui/Textarea';
import { Align, Column, Flex, Gap, Row } from '@/components/layout';
import Button from '@/components/Button';

import { OptionProps } from './types';
import { GIcon, GIconButton } from '@/components/GoogleFontIcon';
import Delimiter from '@/components/Delimiter';

export function PromptTemplateOption({
    nodeData,
    setNodeData,
}: OptionProps) {
    return (
        <Column
            className='undraggable'
            style={{
                gap: '3px',
            }}
        >
            <Row>
                <strong>프롬프트</strong>
                <Flex />
                <Button className='transparent'>
                    <GIcon value='edit' />
                    <span
                        style={{
                            marginLeft: '4px',
                        }}
                    >
                        편집
                    </span>
                </Button>
            </Row>
            <Delimiter />
            <Row>
                <span>선택된 프롬프트</span>
                <Flex />
                <Button className='transparent'>+ 새로운 프롬프트</Button>
            </Row>
            <Gap h='1em' />

            <strong>변수</strong>
            <Delimiter />
            <Row
                className='draggable'
                columnAlign={Align.Center}
            >
                <span>A</span>
                <Flex />
                <GIconButton
                    value='edit'
                    hoverEffect='square'
                />
            </Row>


        </Column>
    )
}