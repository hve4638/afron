import { useEffect, useMemo, useState } from 'react';

import LocalAPI from 'api/local';
import Dropdown from '@/components/ui/Dropdown';
// import DropdownOld, { DropdownItem, DropdownItemList } from '@/components/DropdownOld';
import {
    OpenAIIcon,
    GoogleIcon,
    AnthropicIcon,
    GoogleVertexAIIcon,
    GeminiIcon,
} from 'components/Icons'
import { useConfigStore, useDataStore, useSessionStore } from '@/stores';
import useMemoryStore from '@/stores/useMemoryStore';
import ProfileEvent from '@/features/profile-event';

type ModelDropdownOptions = Array<{ name: string; list: Array<{ name: string; value: string; }> }>;

function useModelDropdown() {
    const only_starred_models = useConfigStore(state => state.only_starred_models);
    const show_actual_model_name = useConfigStore(state => state.show_actual_model_name);

    const starred_models = useDataStore(state => state.starred_models);
    const allModels = useMemoryStore(state => state.allModels);
    const customModels = useDataStore(state => state.custom_models);

    const model_id = useSessionStore(state => state.model_id);
    const updateSessionState = useSessionStore(state => state.update);

    const isModelStarred = (modelId: string) => ProfileEvent.model.isStarred(modelId);

    const options: ModelDropdownOptions = useMemo(() => {
        const nextOptions: ModelDropdownOptions = [];

        for (const category of allModels) {
            const next = {
                name: category.categoryName,
                list: [] as Array<{ name: string; value: string; }>,
            };
            for (const group of category.groups) {
                for (const model of group.models) {
                    if ((!only_starred_models && model.flags.featured) || isModelStarred(model.metadataId)) {
                        next.list.push({
                            name: show_actual_model_name ? model.modelId : model.displayName,
                            value: model.metadataId,
                        });
                    }
                }
            }

            if (next.list.length > 0) {
                nextOptions.push(next);
            }
        }

        {
            const next = {
                name: 'Custom',
                list: [] as Array<{ name: string; value: string; }>,
            };
            for (const model of customModels) {
                if (!only_starred_models || isModelStarred(model.id)) {
                    next.list.push({
                        name: model.name,
                        value: model.id,
                    });
                }
            }
            if (next.list.length > 0) {
                nextOptions.push(next);
            }
        }

        return nextOptions;
    }, [
        allModels,
        customModels,
        starred_models,
        only_starred_models,
        show_actual_model_name
    ]);

    return {
        state: {
            options,
            modelId: model_id,
        },
        setState: {
            modelId: updateSessionState.model_id,
        },
    }
}

export default useModelDropdown;