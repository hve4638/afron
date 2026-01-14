import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useConfigStore } from '@/stores';

interface useAltControlProps {
    // splitMode: boolean;
    setSplitMode: Dispatch<SetStateAction<boolean>>
}

export function useAltControl({
    setSplitMode,
}: useAltControlProps) {
    const commitConfig = useConfigStore(state => state.commit);

    const [altMode, setAltMode] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Alt') setAltMode(true);
        };
        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'Alt') setAltMode(false);
        };
        const handleMouseUp = () => {
            setSplitMode(prev => {
                if (prev) {
                    commitConfig.textarea_io_ratio();
                }
                return false;
            });

        }
        const handleBlur = () => {
            setAltMode(false);
            setSplitMode(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return { altMode }; 
}