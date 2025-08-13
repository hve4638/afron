import { GIconButton } from '@/components/GoogleFontIcon';
import { useModal } from '@/hooks/useModal';
import ModelConfigModal from '@/modals/ModelConfigModal';
import { useConfigStore, useSessionStore } from '@/stores';

function ModelConfigButton() {
    const modal = useModal();
    const modelId = useSessionStore(state => state.model_id);
    const globalModelConfigEnabled = useConfigStore(state => state.global_model_config_enabled);

    if (!globalModelConfigEnabled) {
        return null;
    }

    return (
        <GIconButton
            style={{
                height: '100%',
                aspectRatio: '1/1',
                fontSize: '1.8em',
            }}
            value='tune'
            hoverEffect='square'
            onClick={() => {
                modal.open(ModelConfigModal, {
                    modelId: modelId,
                })

            }}
        />
    )
}

export default ModelConfigButton;