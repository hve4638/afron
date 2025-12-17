import { createContext } from 'react';
import { type RTState } from '@/stores/local';

export const RTStoreContext = createContext<RTState | null>(null);