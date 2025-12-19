import classNames from 'classnames';

import { Center } from '@/components/layout';
import { GoogleFontIcon } from '@/components/atoms';
import { useSplitSlider } from './SplitSlider.hooks';

import styles from './styles.module.scss';

type SplitSliderProps = {
    targetRef: React.RefObject<HTMLDivElement | null>;
}

export function SplitSlider({ targetRef }: SplitSliderProps) {
    const {
        splitMode,
        altMode,
        sliderPosition,
        enableSplitMode,
    } = useSplitSlider({ targetRef });

    return (
        <Center
            className={classNames(
                styles['splitter-handle'],
                {
                    [styles['show']]: altMode || splitMode,
                    [styles['enabled']]: splitMode,
                },
            )}
            style={{
                left: sliderPosition.left,
                top: sliderPosition.top,
                zIndex: 1,
            }}
            onMouseDown={enableSplitMode}
        >
            <GoogleFontIcon value='menu' />
        </Center>
    )
}

export default SplitSlider;