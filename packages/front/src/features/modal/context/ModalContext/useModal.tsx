import { useContextForce } from '@/context';

import { ModalContext } from './ModalContext';

export function useModal() {
    return useContextForce(ModalContext);
}