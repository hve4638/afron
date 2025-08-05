import { InputNode, OutputNode, PromptBuildNode, StringifyChatMLNode, ChatAIFetchNode } from '../nodes';
import { WorkNodeStop } from '../nodes/errors';
import RTWorkflow from './RTWorkflow';
import { UserInput } from '../nodes/types';

class RTWorkflowPromptPreview extends RTWorkflow {
    async process(rtInput: RTInput): Promise<any> {
        const nodeData = await this.getNodeData(rtInput);

        const inputNode = new InputNode(0, nodeData, { inputType: 'normal' });
        const promptBuildNode = new PromptBuildNode(1, nodeData, { promptId: 'default', form: {} });
        const chatAIFetchNode = new ChatAIFetchNode(2, nodeData, { promptId: 'default' });

        let input: UserInput;
        try {
            const inputNodeResult = await inputNode.run({});

            input = inputNodeResult.input;
        }
        catch (error) {
            console.error('Error while getting input:', error);
            if (error instanceof WorkNodeStop) {
                this.rtEventEmitter.emit.error.noResult();
            }
            return;
        }
        

        try {
            const { messages } = await promptBuildNode.run({ input });
            const { result } = await chatAIFetchNode.run({ messages });
        }
        catch (error) {
            if (error instanceof WorkNodeStop) {
                this.rtEventEmitter.emit.error.noResult();
            }
        }
        finally {

        }
    }
}

export default RTWorkflowPromptPreview;