import { IPCInterface } from '@afron/types';

declare global {
    interface Window {
        electron: IPCInterface;
    }
}