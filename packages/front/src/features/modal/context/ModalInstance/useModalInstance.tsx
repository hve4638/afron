import { useContextForce } from '@/context';
import { ModalInstanceContext } from './ModalInstanceContext';

export function useModalInstance() {
    return useContextForce(ModalInstanceContext);
}