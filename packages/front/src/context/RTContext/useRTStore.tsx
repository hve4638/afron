import { RTStoreContext } from './RTStoreContext';
import { useContextForce } from '../utils';

export function useRTStore() {
    return useContextForce(RTStoreContext);
}