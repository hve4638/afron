import { PromptVarForm } from '@/types/prompt-var';
import { PromptEditorDataVarAction } from '../../hooks';

export type AdditionsProps = {
    varId: string;
    target: PromptVarForm;
    varAction: PromptEditorDataVarAction;
}