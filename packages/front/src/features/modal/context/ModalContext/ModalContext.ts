import { createContext, ReactNode, useContext, useRef, useState } from 'react';

interface ModalContextType {
    open: (node: ReactNode) => void;
    count: number;
}

export const ModalContext = createContext<ModalContextType | null>(null);