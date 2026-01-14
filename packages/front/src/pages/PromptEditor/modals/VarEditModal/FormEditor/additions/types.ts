import { SetStateAction } from 'react';
import { PromptVarForm } from '@/types/prompt-var';
import { PromptEditorDataVarAction } from '../../../../hooks';
import { RTVarDataNaive } from '@afron/types';

export type AdditionProps<TType extends PromptVarForm['data']['type'] = PromptVarForm['data']['type']> = {
    varId: string;
    varAction: PromptEditorDataVarAction;
    
    config: NonNullable<PromptVarForm['data']['config'][TType]>;
    onConfigChange: (next: SetStateAction<NonNullable<RTVarDataNaive['config'][TType]>>) => void;
}

