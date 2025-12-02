import useTrigger from '@/hooks/useTrigger';

import EditorSection from './EditorSection';
import SidePanel from './SidePanel';
import usePromptEditor from './PromptEditor.hook';

import styles from './styles.module.scss';
import { ModalProvider } from '@/features/modal';

function PromptEditorInner() {
    const [_, refresh] = useTrigger();
    const {
        promptEditorData,
        promptEditorEvent: {
            emitPromptEditorEvent,
            usePromptEditorEvent,
        }
    } = usePromptEditor({ refresh });

    if (promptEditorData.value == null) {
        return <></>;
    }

    return (
        <div
            className={styles['prompt-editor']}
        >
            <EditorSection
                value={promptEditorData.value}
                action={promptEditorData.action}
            />
            <SidePanel
                value={promptEditorData.value}
                action={promptEditorData.action}
                emitPromptEditorEvent={emitPromptEditorEvent}
                usePromptEditorEvent={usePromptEditorEvent}
            />
        </div>
    );
}

export function PromptEditor() {
    return (
        <ModalProvider>
            <PromptEditorInner />
        </ModalProvider>
    )
}

export default PromptEditor;