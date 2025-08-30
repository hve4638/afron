import {
    CONFIGURATION,
    DEFINITION,
    THEME,
    PROMPT_LANGUAGE,
    PROMPT_THEME
} from './data';

export function registerPromptTemplateLanguage(monaco: any) {
    console.log('registering prompt template language');

    monaco.languages.register({
        id: PROMPT_LANGUAGE,
        // extensions: ['.prompt'],
        aliases: ['Prompt Template', 'prompt-template']
    });

    monaco.languages.setLanguageConfiguration(PROMPT_LANGUAGE, CONFIGURATION);
    monaco.languages.setMonarchTokensProvider(PROMPT_LANGUAGE, DEFINITION);
    monaco.editor.defineTheme(PROMPT_THEME, THEME);
}