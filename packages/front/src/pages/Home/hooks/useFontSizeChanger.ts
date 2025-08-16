import { useEvent } from '@/hooks/useEvent';
import { useConfigStore } from '@/stores';

function useFontSizeChanger() {
    const changeFontSize = (add: number) => {
        const MAX_FONT_SIZE = 48;
        const MIN_FONT_SIZE = 6;
        const { update } = useConfigStore.getState();

        update.font_size(prev => {
            const next = prev + add;

            if (add > 0) {
                if (prev > MAX_FONT_SIZE) return prev;
                else return (
                    next > MAX_FONT_SIZE
                        ? MAX_FONT_SIZE
                        : next
                );
            }
            else {
                if (prev < MIN_FONT_SIZE) return prev;
                else return (
                    next < MIN_FONT_SIZE
                        ? MIN_FONT_SIZE
                        : next
                );
            }
        })
    }

    useEvent('font_size_up', () => changeFontSize(1), []);
    useEvent('font_size_down', () => changeFontSize(-1), []);
}

export default useFontSizeChanger;