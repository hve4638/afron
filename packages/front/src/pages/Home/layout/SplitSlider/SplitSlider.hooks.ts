import { useState } from 'react';

import { useAltControl, useSliderPosition, useSliderState, useSplitAction } from './hooks';

type UseSplitSliderProps = {
    targetRef: React.RefObject<HTMLDivElement | null>;
}

export function useSplitSlider({
    targetRef,
}: UseSplitSliderProps) {
    const {
        rate,
        layoutMode,
    } = useSliderState();

    const [splitMode, setSplitMode] = useState(false);
    const { altMode } = useAltControl({ setSplitMode });
    const sliderPosition = useSliderPosition({ layoutMode, rate });

    useSplitAction({ targetRef, layoutMode, rate, splitMode });

    return {
        sliderPosition,
        altMode,
        splitMode,
        enableSplitMode: () => setSplitMode(true)
    }
}