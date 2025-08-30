import { GlobalEventPipe } from '@/api/events';
import { emitEvent } from '@/hooks/useEvent';
import { emitProgressModalEvent } from '@/modals/ProgressModal/events';

class RTImportManagerSingleton {
    private static instance?: RTImportManagerSingleton;

    private constructor() { }

    static getInstance() {
        this.instance ??= new RTImportManagerSingleton();
        return this.instance;
    }

    importFile(profileId: string, config: { modalId: string; }) {
        GlobalEventPipe.importRTFile(profileId)
            .then((chId) => this.#handleResponse(chId, config));
    }

    async #handleResponse(chId: string, config: { modalId: string; }) {
        let normalExit = false;
        while (true) {
            const data = await GlobalEventPipe.receive(chId);

            if (data == null || data.type === 'close') {
                console.log('Export channel closed', normalExit);

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
                        console.log('done>', data);
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