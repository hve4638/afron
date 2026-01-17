import { useMemo, useRef } from 'react';
import useBootStore from './useBootStore';
import { BeginPhase, BootCompletePhase, LoadGlobalDataPhase, MasterKeyInitializePhase, MigrationPhase } from './phase';

const BOOT: React.ReactNode[] = [
    <BeginPhase />,
    <MasterKeyInitializePhase />,
    <MigrationPhase />,
    <LoadGlobalDataPhase />,
    <BootCompletePhase />,
];

function Bootstrap() {
    const bootState = useBootStore();
    const startTimeRef = useRef<number | null>(null);
    
    const node = useMemo(() => {
        // Log elapsed seconds since the first phase render
        const now = Date.now();
        startTimeRef.current ??= now;
        const elapsedSec = ((now - startTimeRef.current) / 1000).toFixed(2);
        console.log('Bootstrap phase:', bootState.phase, `(+${elapsedSec}s)`);
        startTimeRef.current = now;

        if (bootState.phase < 0 || bootState.phase >= BOOT.length) {
            return <></>;
        }
        else {
            return BOOT[bootState.phase];
        }
    }, [bootState.phase]);

    return node;
}

export default Bootstrap;