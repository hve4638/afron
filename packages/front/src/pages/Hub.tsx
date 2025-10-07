import { HashRouter, Routes, Route } from 'react-router-dom';
import { RTStoreContextProvider } from '@/context';

import Home from './Home';
import PromptEditor from './PromptEditor';
import TestPage from './Test';
import { WorkflowEditor } from './WorkflowEditor';

function Hub() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/test" element={<TestPage />} />
                <Route
                    path="/prompt/:rtId"
                    element={
                        <RTStoreContextProvider>
                            <PromptEditor />
                        </RTStoreContextProvider>
                    }
                />
                <Route
                    path="/workflow/:rtId"
                    element={
                        <RTStoreContextProvider>
                            <WorkflowEditor />
                        </RTStoreContextProvider>
                    }
                />
                <Route
                    path="/workflow/:rtId/prompt/:promptId"
                    element={
                        <RTStoreContextProvider>
                            <PromptEditor />
                        </RTStoreContextProvider>
                    }
                />
            </Routes>
        </HashRouter>
    )
}

export default Hub;