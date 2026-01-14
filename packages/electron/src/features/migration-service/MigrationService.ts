import fs from 'fs';
import path from 'path';
import { v7 as uuidv7 } from 'uuid';

import {
    Profiles,

    RTPromptOnlyTemplateTool,
} from '@afron/core';

import AIFrontPromptLoader from './AIFrontPromptLoader';
import { VarMetadata } from './LegacyPromptParser';

import { AIFRONT_PATH, PROMPT_DIR_PATH } from './data';
import { LegacyAIFrontData, LegacyPromptMetadata, LegacyPromptMetadataList } from './type';

import runtime from '@/runtime'
import { RTMetadataDirectory, RTMetadataNode, RTVar, RTVarConfig, RTVarCreate } from '@afron/types';

type PromptData = { id: string, children?: PromptData[] };

/**
 * ai-front (<0.7) 버전 데이터를 현재 버전으로 마이그레이션셔 
 */
class MigrationService {
    existsLegacyData() {
        if (!fs.existsSync(AIFRONT_PATH)) return false;

        if (fs.existsSync(path.join(AIFRONT_PATH, '.migrated'))) return false;

        if (!fs.existsSync(PROMPT_DIR_PATH)) return false;
        if (!fs.existsSync(path.join(PROMPT_DIR_PATH, 'list.json'))) return false;

        return true;
    }

    async migrate(profiles: Profiles, data: LegacyAIFrontData) {
        const [err, profileId] = await runtime.ipcFrontAPI.profiles.create();
        if (err) return;

        const tree = await Promise.all(data.prompts.map(prompt => this.migratePrompt(profileId, prompt)));

        await runtime.ipcFrontAPI.profileRTs.updateTree(profileId, tree);
        this.setMigrated();
    }

    private async migratePrompt(profileId: string, prompt: LegacyPromptMetadataList | LegacyPromptMetadata): Promise<RTMetadataNode | RTMetadataDirectory> {
        if (prompt instanceof LegacyPromptMetadataList) {
            return {
                type: 'directory',
                name: prompt.name,
                children: await Promise.all(
                    prompt.list.map((subPrompt) => {
                        return this.migratePrompt(profileId, subPrompt);
                    })
                ) as RTMetadataNode[],
            }
        }
        else {
            await prompt.loadPromptTemplate();

            const profile = await runtime.profiles.getProfile(profileId);

            const tool = new RTPromptOnlyTemplateTool(profile);
            await tool.create(prompt.key, prompt.name);
            await tool.inputType('normal');
            await tool.contents(prompt.promptTemplate);

            for (const metadata of prompt.vars) {
                await tool.form(await this.parseVarMetadata(metadata));
            }

            return {
                type: 'node',
                name: prompt.name,
                id: prompt.key,
            }
        }
    }

    private async parseVarMetadata(varMetadata: VarMetadata): Promise<RTVarCreate> {
        switch (varMetadata.type) {
            case 'text':
            case 'text-multiline':
                return {
                    include_type: 'form',
                    name: varMetadata.name,
                    form_name: varMetadata.display_name,
                    data: {
                        type: 'text',
                        config: {
                            text: {
                                placeholder: '',
                                default_value: varMetadata.default_value || '',
                                allow_multiline: varMetadata.type === 'text-multiline',
                            }
                        }
                    },
                };
            case 'select':
                return {
                    include_type: 'form',
                    name: varMetadata.name,
                    form_name: varMetadata.display_name,
                    data: {
                        type: 'select',
                        config: {
                            select: {
                                default_value: varMetadata.default_value ?? '',
                                options: varMetadata.options ?? [],
                            }
                        }
                    }
                }

            case 'number':
                return {
                    include_type: 'form',
                    name: varMetadata.name,
                    form_name: varMetadata.display_name,
                    data: {
                        type: 'number',
                        config: {
                            number: {
                                default_value: varMetadata.default_value || 0,
                                allow_decimal: false,
                            }
                        }
                    }
                };
            case 'boolean':
                return {
                    include_type: 'form',
                    name: varMetadata.name,
                    form_name: varMetadata.display_name,
                    data: {
                        type: 'checkbox',
                        config: {
                            checkbox: {
                                default_value: varMetadata.default_value || false,
                            }
                        }
                    }
                }
            case 'array':
                return {
                    include_type: 'form',
                    name: varMetadata.name,
                    form_name: varMetadata.display_name,
                    data: {
                        type: 'array',
                        config: {
                            array: {
                                minimum_length: 0,
                                maximum_length: 100,
                                ...this.#parseRTVarArray(varMetadata.element),
                            }
                        }
                    }
                }
            case 'struct':
                return {
                    include_type: 'form',
                    name: varMetadata.name,
                    form_name: varMetadata.display_name,
                    data: {
                        type: 'struct',
                        config: {
                            struct: {
                                fields: varMetadata.fields.map(field => this.#parseStructFields(field)),
                            }
                        }
                    }
                }
        }
    }

    #parseRTVarArray(varMetadata: VarMetadata): RTVarConfig.Array {
        switch (varMetadata.type) {
            case 'text':
            case 'text-multiline':
                return {
                    element_type: 'text',
                    config: {
                        text: {
                            placeholder: '',
                            default_value: varMetadata.default_value || '',
                            allow_multiline: varMetadata.type === 'text-multiline',
                        }
                    }
                };
            case 'select':
                return {
                    element_type: 'select',
                    config: {
                        select: {
                            default_value: varMetadata.default_value || '',
                            options: varMetadata.options || [],
                        }
                    }
                };
            case 'number':
                return {
                    element_type: 'number',
                    config: {
                        number: {
                            default_value: varMetadata.default_value || 0,
                            allow_decimal: false,
                        }
                    }
                };
            case 'boolean':
                return {
                    element_type: 'checkbox',
                    config: {
                        checkbox: {
                            default_value: varMetadata.default_value || false,
                        }
                    }
                }
            case 'array':
                throw new Error('Array type is not allowed as an element in another array');
            case 'struct':
                return {
                    element_type: 'struct',
                    config: {
                        struct: {
                            fields: varMetadata.fields.map(field => this.#parseStructFields(field)),
                        },
                    }
                }
        }
    }

    #parseStructFields(fields: VarMetadata): RTVarConfig.StructField {
        switch (fields.type) {
            case 'text':
            case 'text-multiline':
                return {
                    type: 'text',
                    name: fields.name,
                    display_name: fields.display_name,
                    config: {
                        text: {
                            placeholder: '',
                            default_value: fields.default_value || '',
                            allow_multiline: fields.type === 'text-multiline',
                        }
                    }
                };
            case 'select':
                return {
                    type: 'select',
                    name: fields.name,
                    display_name: fields.display_name,
                    config: {
                        select: {
                            default_value: fields.default_value || '',
                            options: fields.options || [],
                        }
                    }
                };
            case 'number':
                return {
                    type: 'number',
                    name: fields.name,
                    display_name: fields.display_name,
                    config: {
                        number: {
                            default_value: fields.default_value || 0,
                            allow_decimal: false,
                        }
                    }
                };
            case 'boolean':
                return {
                    type: 'checkbox',
                    name: fields.name,
                    display_name: fields.display_name,
                    config: {
                        checkbox: {
                            default_value: fields.default_value || false,
                        }
                    },
                }
            case 'struct':
                throw new Error('Struct type is not allowed as a field in another struct');
            case 'array':
                throw new Error('Array type is not allowed as a field in a struct');
        }
    }

    async extract(): Promise<LegacyAIFrontData | null> {
        if (!this.existsLegacyData()) return null;

        try {
            const tree = await AIFrontPromptLoader.loadTree();
            if (!tree) throw new Error('Failed to load tree');

            return {
                prompts: tree.list,
            };

        } catch (e) {
            console.error('## Migration failed');
            console.error(e);
            return null;
        }
    }

    removeLegacySecret() {
        const secretPath = path.join(AIFRONT_PATH, '.secret');
        try {
            fs.unlinkSync(secretPath);
        }
        catch (e) {
            console.warn('## Migration failed to remove legacy secret file');
            console.warn(e);
        }
    }

    setMigrated() {
        fs.writeFileSync(path.join(AIFRONT_PATH, '.migrated'), '');
    }
}

export default MigrationService;