import ModelForm from '@/components/model-ui';
import { Column, Gap } from '@/components/layout';
import { DropdownForm } from '@/components/forms';
import { WorkflowNodeTypes } from '../../nodes';
import { Textarea } from '@/components/ui/Textarea';
import Delimiter from '@/components/Delimiter';
import Button from '@/components/Button';

export function PromptTemplateOption() {
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
            />
            <Button>프롬프트 편집</Button>
        </Column>
    )
}