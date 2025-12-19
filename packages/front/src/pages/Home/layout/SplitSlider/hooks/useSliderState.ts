import { useConfigStore } from '@/stores';

export function useSliderState() {
    const [left, right] = useConfigStore(state=>state.textarea_io_ratio);
    const layoutMode = useConfigStore(state => state.layout_mode);

    const rate = (100 * left) / (left + right);

    return {
        rate,
        layoutMode,
    }
}