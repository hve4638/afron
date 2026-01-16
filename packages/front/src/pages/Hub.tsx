import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { RTStoreContextProvider } from '@/context';

import Home from './Home';
import TestPage from './Test';
import { HubEventHandler } from './Hub.hooks';

const PromptEditor = lazy(() => import('./PromptEditor'));
const WorkflowEditor = lazy(() =>
    import('./WorkflowEditor').then((module) => ({ default: module.WorkflowEditor }))
);

function Hub() {
    return (
        <HashRouter>
            <HubEventHandler/>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/test' element={<TestPage />} />
                <Route
                    path="/prompt/:rtId"
                    element={
                        <RTStoreContextProvider>
                            <Suspense fallback={<div></div>}>
                                <PromptEditor />
                            </Suspense>
                        </RTStoreContextProvider>
                    }
                />
                <Route
                    path='/workflow/:rtId'
                    element={
                        <RTStoreContextProvider>
                            <Suspense fallback={<div></div>}>
                                <WorkflowEditor />
                            </Suspense>
                        </RTStoreContextProvider>
                    }
                />
                <Route
                    path='/workflow/:rtId/prompt/:promptId'
                    element={
                        <RTStoreContextProvider>
                            <Suspense fallback={<div></div>}>
                                <PromptEditor />
                            </Suspense>
                        </RTStoreContextProvider>
                    }
                />
            </Routes>
        </HashRouter>
    )
}

export default Hub;
