import { GlobalEventPipe } from '@/api/events';
import { emitProgressModalEvent } from '@/modals/ProgressModal/events';

class RTExportManagerSington {
    private static instance?: RTExportManagerSington;

    private constructor() { }

    static getInstance() {
        this.instance ??= new RTExportManagerSington();
        return this.instance;
    }

    exportFile(profileId: string, rtId: string, config: { modalId: string; }) {
        GlobalEventPipe.exportFile(profileId, rtId)
            .then((chId) => this.#handleResponse(chId, config));
    }

    async #handleResponse(chId: string, config: { modalId: string; }) {
        while (true) {
            const data = await GlobalEventPipe.receive(chId);

            if (data == null || data.type === 'close') {
                console.log('Export channel closed');

                emitProgressModalEvent('close', { id: config.modalId });
                break;
            }
            else if (data.type === 'export_rt_to_file') {
                console.log('Received export_rt_to_file event:', data);
                
                // emitProgressModalEvent('description', { id: config.modalId, value: data.description });
            }
        }
    }
}

export default RTExportManagerSington;