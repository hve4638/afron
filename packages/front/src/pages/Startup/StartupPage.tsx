import { useEffect, useMemo, useState } from 'react';
import { useStartupStore } from './store';
import { MasterKeyStep, MigrationStep, LoadDataStep, FinalizeStep } from './steps';

const STEPS: React.ReactNode[] = [
    <MasterKeyStep />,
    <MigrationStep />,
    <LoadDataStep />,
    <FinalizeStep />,
];

interface StartupPageProps {
    onComplete?: () => void;
}

/** 앱 실행시 한번 작업하는 startup 과정 */
export function StartupPage({ onComplete }: StartupPageProps) {
    const { step, ready } = useStartupStore();
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);

    useEffect(() => {
        if (ready && !alreadyCompleted) {
            setAlreadyCompleted(true);
            onComplete?.();
        }
    }, [ready, alreadyCompleted, onComplete]);

    const node = useMemo(() => {
        if (step < 0 || step >= STEPS.length) {
            return null;
        }
        return STEPS[step];
    }, [step]);

    return node;
}

export default StartupPage;
