import { Align, Column, Flex, Gap, Row } from '@/components/layout';
import Button from '@/components/Button';
import { GIcon, GIconButton } from '@/components/GoogleFontIcon';
import Delimiter from '@/components/Delimiter';

import { useModal } from '@/hooks/useModal';
import { SelectPromptTemplateModal } from './modals/SelectPromptTemplateModal';

import { RTFlowNodeOptions } from '@afron/types';
import { NodeOptionProps } from '../../types';
import { usePromptTemplateNodeOption } from './PromptTemplateNodeOption.hooks';

export function PromptTemplateNodeOption({
    option,
    setOption,
}: NodeOptionProps<RTFlowNodeOptions.PromptTemplate>) {
    const modals = useModal();
    const {
        emitPromptTemplate,
    } = usePromptTemplateNodeOption({
        option,
        setOption,
    });

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
                <Button
                    className='transparent row'
                    style={{
                        fontSize: '1em',
                    }}
                    onClick={() => {
                        modals.open(SelectPromptTemplateModal,
                            {
                                promptId: option.prompt_id,
                                emitPromptTemplate
                            }
                        )
                    }}
                >
                    <GIcon value='select' />
                    <Gap w='4px' />
                    <span>선택</span>
                </Button>
            </Row>
            <Delimiter />
            {
                option.prompt_id == null &&
                <Button
                    className='transparent wfill'
                    style={{
                        fontSize: '1em',
                    }}
                    onClick={() => {

                    }}
                >
                    <Row
                        className='wfill'
                        rowAlign={Align.Center}
                        columnAlign={Align.Center}
                    >
                        <GIcon value='add' />
                        <span>프롬프트 변경</span>
                    </Row>
                </Button>
            }
            {
                option.prompt_id != null &&
                <Row>
                    <Button
                        className='transparent row'
                        style={{
                            fontSize: '1em',
                        }}
                    >
                        <span>{option.prompt_id}</span>
                    </Button>
                    <Flex />
                    <Button
                        className='transparent row'
                        onClick={() => {
                            emitPromptTemplate('open_prompt_editor', { promptId: option.prompt_id! });
                        }}
                    >
                        <GIcon value='edit' />
                        <Gap w='4px' />
                        <span>편집</span>
                    </Button>
                </Row>
            }
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


        </Column >
    )
}