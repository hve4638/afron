import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type StartupStates = {
    ready: boolean;
    step: number;
    update: {
        ready: (ready: boolean) => void;
        step: (step: number) => void;
        nextStep: () => void;
    }
}

export const useStartupStore = create<StartupStates>()(
    subscribeWithSelector((set) => ({
        ready: false,
        step: 0,

        update: {
            ready: (ready: boolean) => set({ ready }),
            step: (step: number) => set({ step }),
            nextStep: () => set((state) => ({ step: state.step + 1 }))
        },
    }))
);

export default useStartupStore;
