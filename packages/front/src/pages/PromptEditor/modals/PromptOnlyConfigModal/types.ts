import { PromptData } from '@/types';

export type PromptDataPO = Omit<PromptData, 'promptOnly'> & {
    promptOnly: Extract<PromptData['promptOnly'], { enabled: true }>;
};
