import { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import Editor, { useMonaco } from '@monaco-editor/react';
import APTL, {  } from 'advanced-prompt-template-lang';

import useLazyThrottle from '@/hooks/useLazyThrottle';
import { calcTextPosition } from '@/utils';

import type { PromptEditorData } from '@/types';
import { registerPromptTemplateLanguage, PROMPT_THEME, PROMPT_LANGUAGE } from '@/features/monaco-prompt-template-language';

import styles from './styles.module.scss';

type EditorSectionProps = {
    data:PromptEditorData;
}

function EditorSection({
    data,
}:EditorSectionProps) {
    const { t } = useTranslation();
    const monaco = useMonaco();
    const editorRef = useRef<any>(null);
    const [isLanguageRegistered, setIsLanguageRegistered] = useState(false);

    // Register custom language and theme when monaco is available
    useEffect(() => {
        if (monaco && !isLanguageRegistered) {
            try {
                registerPromptTemplateLanguage(monaco);
                setIsLanguageRegistered(true);
            } catch (error) {
                console.error('Failed to register prompt language:', error);
            }
        }
    }, [monaco]);

    const setErrorMarker = (markers:{
        message:string,
        startLineNumber:number, startColumn:number,
        endLineNumber:number, endColumn:number,
    }[]) => {
        if (editorRef.current && monaco) {
            const editor = editorRef.current;
            const model = editor.getModel();

            monaco.editor.setModelMarkers(model, 'owner', 
                markers.map((ele)=>({
                    ...ele,
                    severity: monaco.MarkerSeverity.Error,
                }))
            );
        }
    };

    const clearErrorMarker = () => {
        if (editorRef.current && monaco) {
            const editor = editorRef.current;
            const model = editor.getModel();
            
            monaco.editor.setModelMarkers(model, 'owner', []);
        }
    }

    const lint = useLazyThrottle((text:string)=>{
        const result = APTL.compile(text);
        if (result.errors.length === 0) {
            clearErrorMarker();
        }
        else {
            const markers = result.errors.map((e)=>{
                const {
                    line : startLineNumber,
                    column : startColumn,
                } = calcTextPosition(text, e.position.begin);
                const {
                    line : endLineNumber,
                    column : endColumn,
                } = calcTextPosition(text, e.position.end);
                return {
                    message: t(`prompt.error.${e.error_type}`) + `(${e.error_type})`, 
                    startLineNumber: startLineNumber + 1,
                    endLineNumber: endLineNumber + 1,
                    startColumn: startColumn + 1,
                    endColumn: endColumn + 1,
                }
            });
            console.log('markers')
            console.log(markers)
            setErrorMarker(markers);
        }
    }, 500);

    const editorOptions = {
        minimap: { enabled: false },
        fontFamily: 'Noto Sans KR',
        quickSuggestions: false,
        contextmenu: false,
        lightbulb: { enabled: undefined },
        wordWrap: 'bounded',
        wrappingStrategy: 'advanced',
    };
    
    return (
        <div
            className={styles['editor']}
        >
            <Editor
                options={editorOptions}
                language={isLanguageRegistered ? PROMPT_LANGUAGE : 'plaintext'}
                theme={isLanguageRegistered ? PROMPT_THEME : 'vs-dark'}
                width='100%'
                height='auto'
                value={data.contents}
                onChange={(value)=>{
                    data.contents = value ?? '';
                    data.changed.contents = true;
                    lint(value ?? '');
                }}
                onMount={
                    (editor, monaco) => {
                        editorRef.current = editor;
                        lint(data.contents ?? '');
                    }
                }
            />
        </div>
    )
}

export default EditorSection;