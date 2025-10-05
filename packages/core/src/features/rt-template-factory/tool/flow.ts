import { Profile } from '@/features/profiles';
import { FlowNodeIf, FlowNodePosition } from '@/features/profiles/Profile/rt/types';
import { v7 as uuidv7 } from 'uuid';

export class RTFlowTemplateTool {
    rtId: string = '';

    constructor(private profile: Profile) {

    }

    async create(rtId: string, name: string) {
        this.rtId = (rtId.length > 0) ? rtId : uuidv7()
        await this.profile.addRT({
            name,
            id: this.rtId,
            mode: 'flow',
        });
        return this;
    }

    async addNode(
        type: FlowNodeType,
        data: Record<string, any> = {},
        position: FlowNodePosition = { x: 0, y: 0 }
    ) {
        const rt = this.profile.rt(this.rtId);

        const nodeId = await rt.addNode(type, position);
        await rt.updateNodeData(nodeId, data);

        return nodeId;
    }

    async connect(from: FlowNodeIf, to: FlowNodeIf) {
        const rt = this.profile.rt(this.rtId);

        await rt.connectNode(from, to);
    }

    async addPrompt(promptId: string, contents: string[]) {
        const prompt = contents.join('\n');

        const rt = this.profile.rt(this.rtId);
        await rt.setPromptContents(promptId, prompt);
    }
}