import { Textarea } from '@/components/ui/Textarea';
import { Column } from '@/components/layout';
import Button from '@/components/Button';

import { OptionProps } from './types';
import { GIcon } from '@/components/GoogleFontIcon';

export function PromptTemplateOption({
    nodeData,
    setNodeData,
}: OptionProps) {
    return (
        <Column
            style={{
                gap: '3px',
            }}
        >
            <strong>프롬프트</strong>
            {/* <Delimiter /> */}
            {/* <Textarea
                style={{
                    height: '16em',
                    fontSize: '0.75em',
                    marginBottom: '4px',
                }}
                value={nodeData['description']}
                onChange={() => {}}
            /> */}
            <Button>프롬프트 편집</Button>
            <Button><GIcon value='edit'/>프롬프트</Button>
        </Column>
    )
}