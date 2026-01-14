import APTL, { TemplateOutput, PromptGenerator } from 'advanced-prompt-template-lang';
import { Chat, ChatMessages, ChatRole } from '@hve/chatai';
import { BUILT_IN_VARS, HOOKS } from '../data';
import { WorkNodeStop } from './errors';
import WorkNode from './WorkNode';
import { UserInput } from './types';
import ChatGenerator from '../prompt-generator/ChatGenerator';
import { InputPromptGenerator } from '../prompt-generator';
import { RTVar, RTVarForm } from '@afron/types';

export type PromptBuildNodeInput = {
    input: UserInput;
}
export type PromptBuildNodeOutput = {
    messages: ChatMessages;
}
export type PromptBuildNodeOption = {
    promptId: string;
    form: {
        [key: string]: { link: true, src: string, value?: unknown } | { link?: false, value: unknown };
    };
}

function getDefaultValue(rtVar: RTVarForm): unknown {
    const data = rtVar.data;
    switch (data.type) {
        case 'checkbox':
        case 'text':
        case 'number':
            return data.config[data.type].default_value;
        case 'select':
            const selectConfig = data.config.select;
            if (selectConfig.default_value) {
                return selectConfig.default_value;
            }
            else {
                return selectConfig.options[0]?.value ?? null;
            }
        case 'array':
            return [];
        case 'struct':
            return {};
    }
}

class PromptBuildNode extends WorkNode<PromptBuildNodeInput, PromptBuildNodeOutput, PromptBuildNodeOption> {
    override name = 'PromptBuildNode';

    override async process(
        {
            input,
        }: PromptBuildNodeInput,
    ) {
        const {
            profile, rtId, rtEventEmitter, chat
        } = this.nodeData;
        const rt = profile.rt(rtId);
        const rtVar = await rt.prompt.getVariables(this.option.promptId);
        const contents = await rt.prompt.getContents(this.option.promptId);

        const { form } = this.nodeData;
        const vars = {};
        for (const v of rtVar) {
            if (v.include_type === 'form') {
                vars[v.name] = form[v.id!] ?? getDefaultValue(v);
            }
            else if (v.include_type === 'external') {

            }
            else if (v.include_type === 'constant') {
                vars[v.name] = v.value;
            }
        }

        const compileOutput = APTL.compile(contents);
        if (!compileOutput.ok) {
            this.logger.error(`Prompt build failed (id=${this.nodeId})`);

            rtEventEmitter.emit.error.promptBuildFailed(
                compileOutput.errors.map((reason) => {
                    this.logger.debug(`Prompt build failed ${reason.error_type}`);
                    return `${reason.text} (${reason.position.begin})`;
                })
            );
            throw new WorkNodeStop();
        }

        const additionalBuiltInVars = {};
        additionalBuiltInVars['input'] = new InputPromptGenerator({ text: input.text, files: input.files });
        additionalBuiltInVars['chat'] = new ChatGenerator(chat);

        let generator: Generator<TemplateOutput>;
        try {
            generator = APTL.execute(compileOutput, {
                builtInVars: {
                    ...BUILT_IN_VARS,
                    ...additionalBuiltInVars,
                },
                vars: vars,
                hook: HOOKS,
            });
        }
        catch (e) {
            throw new WorkNodeStop();
        }

        const promptMessage: ChatMessages = [];
        try {
            APTL.format(generator, {
                role: ({ role }) => {
                    switch (role.toLowerCase()) {
                        case 'system':
                            promptMessage.push(ChatRole.System());
                            break;
                        case 'assistant':
                        case 'model':
                        case 'bot':
                            promptMessage.push(ChatRole.Assistant());
                            break;
                        case 'user':
                        default:
                            promptMessage.push(ChatRole.User());
                            break;
                    }
                },
                text: ({ text }) => {
                    promptMessage.at(-1)?.content.push(Chat.Text(text));
                },
                image: ({ data, dataType, filename }) => {
                    promptMessage.at(-1)?.content.push(Chat.Image.Base64(data));
                },
                file: ({ data, dataType, filename }) => {
                    promptMessage.at(-1)?.content.push(Chat.PDF.Base64(filename, data));
                },
            });
        }
        catch (e) {
            this.logger.warn(e);

            rtEventEmitter.emit.error.promptEvaluateFailed(
                [(e as any).message]
            );
            throw new WorkNodeStop();
        }
        return { messages: promptMessage };
    }
}

export default PromptBuildNode;