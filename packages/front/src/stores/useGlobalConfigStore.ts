import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { RefetchMethods, UpdateMethods } from './types';
import { globalStoreTool, profileStoreTool } from './utils';

interface GlobalConfigFields {
    shared_mode: boolean;
    hardware_acceleration: boolean;
}

const defaultCache:GlobalConfigFields = {
    shared_mode: false,
    hardware_acceleration: false,
}

interface GlobalConfigState extends GlobalConfigFields {
    update : UpdateMethods<GlobalConfigFields>;
    refetch : RefetchMethods<GlobalConfigFields>;
    refetchAll : () => Promise<void>;
}

const useGlobalConfigStore = create<GlobalConfigState>()(
    subscribeWithSelector((set, get)=>{
        const {
            update,
            refetch,
            refetchAll
        } = globalStoreTool<GlobalConfigFields>(set, get, 'config.json', defaultCache);
    
        return {
            ...defaultCache,
            update,
            refetch,
            refetchAll
        }
    })
);


export default useGlobalConfigStore;