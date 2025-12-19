import { LayoutModes } from '@/types/profile';

interface UsePositionCalcProps {
    rate: number;
    layoutMode: LayoutModes;
}

export function useSliderPosition({
    rate,
    layoutMode
}: UsePositionCalcProps) {
    const left = layoutMode === 'horizontal' ? `${rate}%` : '50%'
    const top = layoutMode === 'vertical' ? `${rate}%` : '50%';

    
    return {
        left, top
    }
}