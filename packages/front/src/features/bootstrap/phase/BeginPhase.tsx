import { useEffect } from 'react';
import useBootStore from '../useBootStore';

function BeginPhase() {
    const { update } = useBootStore();

    useEffect(()=>{
        update.nextPhase();
    }, [])

    return (
        <div></div>
    );
}

export default BeginPhase;