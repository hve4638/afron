import { BrowserRouter, Routes, Route } from 'react-router';
import { ModalProvider } from '@/hooks/useModal';

import Home from '@/pages/Home';
import ComponentsDemo from '@/pages/ComponentsDemo';
import FormsDemo from '@/pages/FormsDemo';
import ModalsDemo from '@/pages/ModalsDemo';

import './assets/index.scss';

function App() {
    return (
        <BrowserRouter>
            <ModalProvider>
                <div
                    id="app"
                    style={{
                        minHeight: '100vh',
                        background: '#ffffff',
                        color: '#333333',
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/components" element={<ComponentsDemo />} />
                        <Route path="/forms" element={<FormsDemo />} />
                        <Route path="/modals" element={<ModalsDemo />} />
                    </Routes>
                </div>
            </ModalProvider>
        </BrowserRouter>
    );
}

export default App;
