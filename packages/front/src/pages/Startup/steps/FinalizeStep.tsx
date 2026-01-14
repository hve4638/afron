import { useEffect } from 'react';
import { useStartupStore } from '../store';

function FinalizeStep() {
    const { update } = useStartupStore();

    useEffect(() => {
        update.ready(true);
    }, []);

    return null;
}

export default FinalizeStep;
