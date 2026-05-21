import { GlobalEventPipe } from '@/api/events';
import LocalAPI from '@/api/local';
import { type IIPCAPI } from '@/api/local/types';
import { emitProgressModalEvent } from '@/modals/ProgressModal/events';

const isWeb = import.meta.env['VITE_BACKEND'] === 'web';
// 빌드별 alias로 LocalAPI는 ElectronIPCAPI 또는 WebHTTPAPI로 해석된다.
// `platform.web`은 web 빌드에만 존재하므로 IIPCAPI 캐스트로 접근한다.
const localAPI = LocalAPI as unknown as IIPCAPI;

class RTExportManagerSingleton {
    private static instance?: RTExportManagerSingleton;

    private constructor() { }

    static getInstance() {
        this.instance ??= new RTExportManagerSingleton();
        return this.instance;
    }

    /**
     * 플랫폼에 맞는 export 방식을 자동 선택한다.
     * - web: HTTP GET → 브라우저 다운로드 (WS 이벤트 불필요)
     * - electron: 네이티브 dialog + IPC + WS 이벤트로 진행 보고
     */
    exportFile(profileId: string, rtId: string, config: { modalId: string; }) {
        if (isWeb) {
            return this.#exportFileWeb(profileId, rtId, config);
        }
        return this.#exportFileNative(profileId, rtId, config);
    }

    #exportFileNative(profileId: string, rtId: string, config: { modalId: string; }) {
        GlobalEventPipe.exportFile(profileId, rtId)
            .then((chId) => this.#handleResponse(chId, config));
    }

    async #exportFileWeb(profileId: string, rtId: string, config: { modalId: string; }) {
        try {
            emitProgressModalEvent('description', {
                id: config.modalId, value: 'Exporting...',
            });

            await localAPI.platform!.web!.downloadRTFile(profileId, rtId);

            emitProgressModalEvent('close', { id: config.modalId });
        }
        catch (e: any) {
            emitProgressModalEvent('description', {
                id: config.modalId,
                value: e.message ?? '내보내기에 실패했습니다',
            });
            emitProgressModalEvent('show_close_button', { id: config.modalId });
        }
    }

    async #handleResponse(chId: string, config: { modalId: string; }) {
        while (true) {
            const data = await GlobalEventPipe.receive(chId);

            if (data == null || data.type === 'close') {
                emitProgressModalEvent('close', { id: config.modalId });
                break;
            }
            else if (data.type === 'rt_export') {
                switch (data.state) {
                    case 'ready':
                        emitProgressModalEvent('description', { id: config.modalId, value: 'Exporting...' });
                        break;
                    case 'done':
                        break;
                }
            }
        }
    }
}

export default RTExportManagerSingleton;
