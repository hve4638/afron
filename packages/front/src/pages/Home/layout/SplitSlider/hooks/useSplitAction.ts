import { useEffect } from 'react';
import { useConfigStore } from '@/stores';
import useMouseDelta from '@/hooks/useMouseDelta';
import { LayoutModes } from '@/types/profile';

interface useSplitActionProps {
    targetRef: React.RefObject<HTMLDivElement | null>;
    rate: number;
    splitMode: boolean;
    layoutMode: LayoutModes;
}

export function useSplitAction({
    targetRef,
    rate,
    splitMode,
    layoutMode,
}: useSplitActionProps) {
    const localUpdateConfig = useConfigStore(state => state.localUpdate);
    const [mouseDelta, capture] = useMouseDelta(4, splitMode);

    const getRect = () => {
        if (targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();

            return {
                width: rect.width,
                height: rect.height,
            }
        }
        else {
            return {
                width: 0,
                height: 0,
            }
        }
    };

    useEffect(() => {
        if (!splitMode) return;

        let nextLeft: number;
        let nextRight: number;
        const isHorizontal = (layoutMode === 'horizontal');
        const { width, height } = getRect();

        if (isHorizontal) {
            if (mouseDelta.x === 0) return;
            const current = width * rate / 100;

            nextLeft = current + mouseDelta.x;
            nextRight = width - nextLeft;
        }
        else {
            if (mouseDelta.y === 0) return;
            const current = height * rate / 100;

            nextLeft = current + mouseDelta.y;
            nextRight = height - nextLeft;
        }

        // 2:8 비율 초과 시 반영하지 않음
        // 초과한 마우스 이동거리는 mouseDelta에 유지해서 반대 방향 슬라이드 시 자연스럽게 작동하도록 함
        const total = nextLeft + nextRight;
        const nextLeftRate = 10 * nextLeft;
        if (nextLeftRate < 2 * total) {
            const exceeded = (nextLeftRate - (2 * total)) / 10

            if (isHorizontal) capture(exceeded, 0);
            else capture(0, exceeded);
            localUpdateConfig.textarea_io_ratio([2, 8]);
        }
        else if (nextLeftRate > 8 * total) {
            const exceeded = (nextLeftRate - (8 * total)) / 10;

            if (isHorizontal) capture(exceeded, 0);
            else capture(0, exceeded);
            localUpdateConfig.textarea_io_ratio([8, 2]);
        }
        else {
            capture();
            localUpdateConfig.textarea_io_ratio([nextLeft, nextRight]);
        }
    }, [mouseDelta]);

    return {
        
    }
}