import { RTFlowNodeOptions } from '@afron/types';

import { Align, Column, Flex, Gap, Row } from '@/components/layout';
import Button from '@/components/atoms/Button';
import { GIcon, GIconButton } from '@/components/atoms/GoogleFontIcon';
import Delimiter from '@/components/atoms/Delimiter';

import { useModal } from '@/hooks/useModal';
import { SelectPromptTemplateModal } from './modals/SelectPromptTemplateModal';


import { NodeOptionProps } from '../../types';
import { usePromptTemplateNodeOption } from './PromptTemplateNodeOption.hooks';
import { useParams } from 'react-router';

export function PromptTemplateNodeOption({
    option,
    setOption,
}: NodeOptionProps<RTFlowNodeOptions.PromptTemplate>) {
    const { rtId } = useParams();
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
                <strong>프롬프트 템플릿</strong>
                <Flex />
                <Button
                    className='transparent row'
                    style={{
                        fontSize: '1em',
                    }}
                    onClick={() => {
                        modals.open(SelectPromptTemplateModal,
                            {
                                rtId: rtId as string,
                                initPromptId: option.prompt_id,
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
                        <span>새 프롬프트 템플릿</span>
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