import { Profile } from '../profiles';
import { RTFlowTemplateTool } from './tool';

export class FlowTemplateFactory {
    private static async createTool(profile: Profile, rtId: string, name: string) {
        const tool = new RTFlowTemplateTool(profile);

        await tool.create(rtId.trim(), name.trim());
        return tool;
    }

    static async empty(profile: Profile, rtId: string, name: string) {
        await this.createTool(profile, rtId, name);
    }

    static async normal(profile: Profile, rtId: string, name: string) {
        const tool = await this.createTool(profile, rtId, name);
        const pos = (x: number, y: number) => ({ x, y });

        const inputNode = await tool.addNode('input', pos(0, 0));
        const promptNode = await tool.addNode('prompt-template', {
            prompt_id: 'prompt_0',
        }, pos(100, 0));
        const llmFetchNode = await tool.addNode('llm-fetch', {}, pos(200, 0));
        const outputNode = await tool.addNode('output', {}, pos(300, 0));

        await tool.addPrompt('prompt_0', [
            '{{:input}}',
        ]);
        await tool.connect(
            { node: inputNode, ifName: 'input' },
            { node: promptNode, ifName: 'input' },
        );
        await tool.connect(
            { node: promptNode, ifName: 'messages' },
            { node: llmFetchNode, ifName: 'messages' },
        );
        await tool.connect(
            { node: llmFetchNode, ifName: 'llm result' },
            { node: outputNode, ifName: 'output' },
        );
    }

}