import useProfileAPIStore from '@/stores/useProfileAPIStore';
import useCacheStore from '@/stores/useCacheStore';
import useSessionStore from '@/stores/useSessionStore';
import { RTFormWithLastValue, ProviderName } from '../types';
import { RTFormNaive } from '@afron/types';

class CurrentSessionFormEvent {
    static async getCurrentSessionForms(): Promise<RTFormWithLastValue[]> {
        const { api } = useProfileAPIStore.getState();
        const { rt_id } = useSessionStore.getState();
        const { last_session_id } = useCacheStore.getState();

        if (last_session_id == null) throw new Error('last_session_id is null');

        const rt = api.rt(rt_id);
        const session = api.session(last_session_id);

        const forms: RTFormWithLastValue[] = await rt.getForms();
        const formValues = await session.getFormValues(rt_id);

        for (const form of forms) {
            form.last_value = formValues[form.id!];
        }
        return forms;
    }

    static async setCurrentSessionForms(values: Record<string, any>) {
        const { api } = useProfileAPIStore.getState();
        const { rt_id } = useSessionStore.getState();
        const { last_session_id } = useCacheStore.getState();

        if (last_session_id == null) throw new Error('last_session_id is null');

        const session = api.session(last_session_id);

        await session.setFormValues(rt_id, values);
    }
}

export default CurrentSessionFormEvent;