import LocalAPI from '@/api/local';
import { useConfigStore } from '@/stores';
import { useEffect, useState } from 'react';

export function useAdvancedOptions() {
    const {
        prompt_preview_enabled,
        global_model_config_enabled,
        show_token_count,
        update,
    } = useConfigStore();
    
    const [
        hardwareAccelerationEnabled,
        setHardwareAccelerationEnabled
    ] = useState<boolean | null>(null);

    useEffect(() => {
        LocalAPI.globalConfig.getHardwareAccelerationEnabled()
            .then(setHardwareAccelerationEnabled);
    });

    const updateHardwareAccelerationEnabled = (enabled: boolean) => {
        setHardwareAccelerationEnabled(enabled);
        LocalAPI.globalConfig.setHardwareAccelerationEnabled(enabled);
    }

    return {
        state: {
            promptPreviewEnabled: prompt_preview_enabled,
            globalModelConfigEnabled: global_model_config_enabled,
            showTokenCount: show_token_count,

            hardwareAccelerationEnabled,
        },
        update: {
            promptPreviewEnabled: update.prompt_preview_enabled,
            globalModelConfigEnabled: update.global_model_config_enabled,
            showTokenCount: update.show_token_count,

            hardwareAccelerationEnabled: updateHardwareAccelerationEnabled,
        }
    }
}