import { useState } from 'react';
import { useParams } from 'react-router';

import { createRTStore } from '@/stores/local'
import { RTStoreContext } from './RTStoreContext';

export function RTStoreContextProvider({ children }: { children: React.ReactNode }) {
    const { rtId } = useParams();
    const [useRTStore] = useState(() => createRTStore(rtId ?? 'unknown'));
    const store = useRTStore();

    return (
        <RTStoreContext.Provider
            value={store}
        >
            {children}
        </RTStoreContext.Provider>
    );
};