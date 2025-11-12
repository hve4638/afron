import { uuidv7 } from '@/lib/uuid';
import { ProfileStorage } from '@afron/types';

type LegacyPromptVar = {
    form_id: string;
    name: string;
}

/**
 * 기존 포맷 LegacyPromptVar 형태를 현재 ProfileStorage.RT.PromptVar 형태로 변환
 * @param promptVar 
 */
export function fixPromptVarLegacy(promptVar: Partial<ProfileStorage.RT.PromptVar>): ProfileStorage.RT.PromptVar {
    if (promptVar.type != null) return promptVar as ProfileStorage.RT.PromptVar;

    const legacyVar = promptVar as LegacyPromptVar;
    return {
        type: 'form',
        id: promptVar.id ?? uuidv7(),
        form_id: legacyVar.form_id,
        name: legacyVar.name,
    };
}