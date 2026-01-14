import { uuidv7 } from '@/lib/uuid';
import { ProfileStorageSchema } from '@afron/types';

type PromptVar = ProfileStorageSchema.RT.Prompts['variables'][number];

type LegacyPromptVar = {
    form_id: string;
    name: string;
}

/**
 * 기존 포맷 LegacyPromptVar 형태를 현재 PromptVar 형태로 변환
 * @param promptVar 
 */
export function fixPromptVarLegacy(promptVar: Partial<PromptVar>): PromptVar {
    if (promptVar.type != null) return promptVar as PromptVar;

    const legacyVar = promptVar as LegacyPromptVar;
    return {
        type: 'form',
        id: promptVar.id ?? uuidv7(),
        form_id: legacyVar.form_id,
        name: legacyVar.name,
    };
}