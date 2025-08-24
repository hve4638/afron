import { ModalProvider, useModal } from '@/hooks/useModal';
import useTrigger from '@/hooks/useTrigger';
import type {
    PromptInputType
} from '@/types';

import EditorSection from './EditorSection';
import SidePanel from './SidePanel';
import usePromptEditor from './PromptEditor.hook';

import styles from './styles.module.scss';

function PromptEditor() {
    const [_, refresh] = useTrigger();
    const {
        ref: {
            editorData,
        },
        state: {
            loaded,
            saved,
        },
        action: {
            save,
            back,
            addPromptVar,
        }
    } = usePromptEditor({ refresh });

    if (!loaded) {
        return <></>
    }
    return (
        <div
            className={styles['prompt-editor']}
        >
            <EditorSection data={editorData.current} />
            <SidePanel
                data={editorData.current}
                saved={saved}

                onRefresh={() => refresh()}
                onSave={async () => await save()}
                onBack={async () => back()}

                onAddPromptVar={() => {
                    const promptVar = addPromptVar();

                    return promptVar;
                }}
                onRemovePromptVar={(promptVar: PromptVar) => {
                    editorData.current.variables = editorData.current.variables.filter((item) => item !== promptVar);
                    editorData.current.changedVariables = editorData.current.changedVariables.filter((item) => item !== promptVar);
                    if (promptVar.id) {
                        editorData.current.removedVariables.push(promptVar.id);
                    }

                    refresh();
                }}
                onChangeInputType={(inputType: PromptInputType) => {
                    return;
                }}
            />
        </div>
    );
}

function PromptEditorWrapper() {
    return (
        <ModalProvider>
            <PromptEditor />
        </ModalProvider>
    )
}

export default PromptEditorWrapper;