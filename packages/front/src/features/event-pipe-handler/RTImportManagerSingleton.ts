import { GlobalEventPipe } from '@/api/events';
import LocalAPI from '@/api/local';
import { type IIPCAPI } from '@/api/local/types';
import { emitEvent } from '@/hooks/useEvent';
import { emitProgressModalEvent } from '@/modals/ProgressModal/events';

const isWeb = import.meta.env['VITE_BACKEND'] === 'web';
// 빌드별 alias로 LocalAPI는 ElectronIPCAPI 또는 WebHTTPAPI로 해석된다.
// `platform.web`은 web 빌드에만 존재하므로 IIPCAPI 캐스트로 접근한다.
const localAPI = LocalAPI as unknown as IIPCAPI;

class RTImportManagerSingleton {
    private static instance?: RTImportManagerSingleton;

    private constructor() { }

    static getInstance() {
        this.instance ??= new RTImportManagerSingleton();
        return this.instance;
    }

    /**
     * 플랫폼에 맞는 import 방식을 자동 선택한다.
     * - web: <input type="file"> + multipart upload
     * - electron: 네이티브 dialog + IPC
     */
    importFile(profileId: string, config: { modalId: string; }) {
        if (isWeb) {
            return this.#importFileWeb(profileId, config);
        }
        return this.#importFileNative(profileId, config);
    }

    #importFileNative(profileId: string, config: { modalId: string; }) {
        GlobalEventPipe.importRTFile(profileId)
            .then((chId) => this.#handleResponse(chId, config));
    }

    #importFileWeb(profileId: string, config: { modalId: string; }) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.afrt';

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) {
                emitProgressModalEvent('close', { id: config.modalId });
                return;
            }

            try {
                const token = await localAPI.platform!.web!.uploadRTFile(profileId, file);
                GlobalEventPipe.openWith(token);
                this.#handleResponse(token, config);
            }
            catch (e: any) {
                emitProgressModalEvent('description', {
                    id: config.modalId,
                    value: e.message ?? '파일 업로드에 실패했습니다',
                });
                emitProgressModalEvent('show_close_button', { id: config.modalId });
            }
        };

        input.click();
    }

    async #handleResponse(chId: string, config: { modalId: string; }) {
        let normalExit = false;
        while (true) {
            const data = await GlobalEventPipe.receive(chId);

            if (data == null || data.type === 'close') {
                if (!normalExit) {
                    emitProgressModalEvent('close', { id: config.modalId });
                }
                break;
            }
            else if (data.type === 'rt_import') {
                switch (data.state) {
                    case 'ready':
                        emitProgressModalEvent('description', { id: config.modalId, value: 'Importing...' });
                        break;

                    case 'failed':
                        emitProgressModalEvent('description', { id: config.modalId, value: '요청 템플릿을 가져오는데 실패했습니다' });
                        emitProgressModalEvent('show_close_button', { id: config.modalId, });
                        normalExit = true;
                        break;

                    case 'done':
                        emitProgressModalEvent('description', { id: config.modalId, value: '성공적으로 불러왔습니다' });
                        emitProgressModalEvent('show_close_button', { id: config.modalId, });
                        emitEvent('refresh_rt_tree');
                        normalExit = true;
                        break;
                }
            }
        }
    }
}

export default RTImportManagerSingleton;
