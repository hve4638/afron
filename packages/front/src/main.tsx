import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@xyflow/react/dist/style.css'; // XYFlow 기본 스타일
import App from './App.tsx'
import DebugApp from './DebugApp.tsx'
import './index.css'
import 'assets/style/index.scss'
import 'locales';


const testMode = import.meta.env['VITE_TEST']?.toUpperCase() === 'TRUE'
if (testMode) {
    createRoot(document.getElementById('root')!).render(
        // <StrictMode>
            <DebugApp/>
        // </StrictMode>
    )
}
else {
    createRoot(document.getElementById('root')!).render(
        // <StrictMode>
            <App/>
        // </StrictMode>
    )
}


