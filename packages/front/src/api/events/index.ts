import RequestEventPipeSingleton from './RequestEventPipe';
import GlobalEventPipeSingleton from './GlobalEventPipe';

export const RequestEventPipe = RequestEventPipeSingleton.getInstance();
export const GlobalEventPipe = GlobalEventPipeSingleton.getInstance();