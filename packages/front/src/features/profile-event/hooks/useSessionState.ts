import { deriveSessionState, type SessionStateType } from '../utils/sessionState';
import { useSessionStore } from '@/stores';

export function useSessionState(): SessionStateType {
    const runningRt = useSessionStore((state) => state.running_rt);

    return deriveSessionState(runningRt);
}
