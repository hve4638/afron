import { Textarea } from '@/components/ui/Textarea';
import { Column } from '@/components/layout';
import Button from '@/components/Button';

import { OptionProps } from './types';

export function PromptTemplateOption({
    nodeData,
    refresh,
}: OptionProps) {
    return (
        <Column
            style={{
                gap: '3px',
            }}
        >
            <strong>프롬프트</strong>
            {/* <Delimiter /> */}
            <Textarea
                style={{
                    height: '16em',
                    fontSize: '0.75em',
                    marginBottom: '4px',
                }}
                value={nodeData['description']}
                onChange={() => refresh()}
            />
            <Button>프롬프트 편집</Button>
        </Column>
    )
}