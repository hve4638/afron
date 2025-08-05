import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatAIFetcher from './ChatAIFetcher';
import { resolveModelConfiguration } from '../model-configuration-resolver';
import { ChatAIModels } from '@afron/chatai-models';

describe('ChatAIFetcher', () => {
    let fetcher: ChatAIFetcher;

    beforeEach(() => {
        fetcher = new ChatAIFetcher();
    });

    it('should fetch chat AI responses', async () => {
        const modelConfiguration = resolveModelConfiguration();
        const map = ChatAIModels.getModelMap();
        
        const result = await fetcher.request({
            model: map['openai:gpt-4o'],
            messages: [{ role: 'user', content: [] }],
            modelConfiguration,
            auth: 'test-auth',
        }, { preview: true });
        const actual = result.request.data;
        const expected = {
            model: 'gpt-4o',
            messages: [],
            temperature: 1,
            top_p: 1.0,
            max_completion_tokens: 4096,
        }
        expect(actual).toEqual(expected);
    });
});