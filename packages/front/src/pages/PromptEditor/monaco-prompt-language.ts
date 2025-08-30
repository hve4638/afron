// Afron Prompt Template Language Definition
// Monaco API will be accessed through useMonaco() hook
export const promptLanguageId = 'afron-prompt-template';

export const promptLanguageDefinition = {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: 'invalid',

    // Tokenizer rules
    tokenizer: {
        root: [
            // Template expressions starting with {{
            [/\{\{/, { token: 'delimiter.template', bracket: '@open', next: '@template' }],

            // Regular text
            [/[^{]+/, 'text'],
            [/./, 'text']
        ],

        template: [
            // End of template expression
            [/\}\}/, { token: 'delimiter.template', bracket: '@close', next: '@pop' }],

            // Special input variables {{:input}}, {{:chat}}
            [/:(input|chat|blank|nl)\b/, 'variable.special'],

            // Role directive - split ::role and role name
            [/::role/, 'keyword.role.directive'],
            [/(system|user|assistant|model|bot)\b/, 'keyword.role.name'],

            // Control flow directives
            [/::(if|else|endif|foreach|endforeach)\b/, 'keyword.control'],

            // Function calls - func() pattern
            [/[a-zA-Z_][a-zA-Z0-9_]*(?=\()/, 'function'],
            [/\(/, 'bracket'],
            [/\)/, 'bracket'],

            // Array access - arr[index] pattern
            [/[a-zA-Z_][a-zA-Z0-9_]*(?=\[)/, 'variable.name'],
            [/\[/, { token: 'bracket', next: '@arrayIndex' }],

            // Dot separator for property access
            [/\./, { token: 'white', next: '@property' }],

            // Simple variables
            [/[a-zA-Z_][a-zA-Z0-9_]*/, 'variable.name'],

            // String literals (for conditions, array iteration)
            [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-terminated string
            [/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-terminated string
            [/"/, 'string', '@string_double'],
            [/'/, 'string', '@string_single'],

            // Numbers
            [/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
            [/\d+/, 'number'],

            // Operators
            [/[=<>!]+/, 'operator'],
            [/[+\-*/]/, 'operator.arithmetic'],

            // Whitespace
            [/[ \t\r\n]+/, 'white'],

            // Comments (if supported)
            [/#.*$/, 'comment'],
        ],

        string_double: [
            [/[^\\"]+/, 'string'],
            [/\\./, 'string.escape.invalid'],
            [/"/, 'string', '@pop']
        ],

        string_single: [
            [/[^\\']+/, 'string'],
            [/\\./, 'string.escape.invalid'],
            [/'/, 'string', '@pop']
        ],

        arrayIndex: [
            // Numbers in array index
            [/\d+/, 'number'],
            [/\d*\.\d+/, 'number.float'],
            
            // Variables in array index
            [/[a-zA-Z_][a-zA-Z0-9_]*/, 'indexor'],
            
            // String literals in array index
            [/"([^"\\]|\\.)*"/, 'string'],
            [/'([^'\\]|\\.)*'/, 'string'],
            
            // Close bracket and return to template state
            [/\]/, { token: 'bracket', next: '@pop' }],
            
            // Whitespace
            [/[ \t]+/, 'white'],
            
            // Operators in array index
            [/[+\-*/]/, 'operator.arithmetic'],
        ],

        property: [
            // Property names after dot
            [/[a-zA-Z_][a-zA-Z0-9_]*(?=\()/, { token: 'function', next: '@pop' }],  // method calls
            [/[a-zA-Z_][a-zA-Z0-9_]*/, { token: 'variable.property', next: '@pop' }], // properties
            
            // Handle other cases and return to template state
            [/./, { token: '@rematch', next: '@pop' }]
        ],
    }
};

// Language configuration
export const promptLanguageConfiguration = {
    // comments: {
    //     lineComment: '#',
    // },
    brackets: [
        // ['{', '}'],
        // ['[', ']'],
        // ['(', ')']
    ],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
    ],
    folding: {
        markers: {
            start: new RegExp('^\\s*{{::(?:if|foreach)\\b'),
            end: new RegExp('^\\s*{{::(?:endif|endforeach)\\b')
        }
    }
};

// Custom theme for prompt template language
export const promptTemplateTheme = {
    base: 'vs-dark',
    inherit: true,
    rules: [
        // Template delimiters
        { token: 'delimiter.template', foreground: '#D4D4AA' },

        // Keywords
        { token: 'keyword.control', foreground: '#c586c0' },
        { token: 'keyword.role.directive', foreground: '#9b9b9b' },
        { token: 'keyword.role.name', foreground: '#d69d85' },

        // Functions and brackets
        { token: 'function', foreground: '#dcdcaa' },
        { token: 'bracket', foreground: '#ce70d6' },
        { token: 'indexor', foreground: '#da70d6' },

        // Variables
        { token: 'variable.special', foreground: '#9cdcfe' },
        { token: 'variable.name', foreground: '#4fc1ff' },
        // { token: 'variable.name', foreground: '#2790f1' },
        { token: 'variable.property', foreground: '#9cdcfe' },
        { token: 'variable.array', foreground: '#FFA726' },

        // Literals
        { token: 'string', foreground: '#CE9178' },
        { token: 'string.invalid', foreground: '#FF5252' },
        { token: 'number', foreground: '#B5CEA8' },
        { token: 'number.float', foreground: '#B5CEA8' },

        // Operators
        { token: 'operator', foreground: '#D4D4D4' },
        { token: 'operator.arithmetic', foreground: '#D4D4D4' },

        // Comments
        { token: 'comment', foreground: '#6A9955', fontStyle: 'italic' },

        // Text content and whitespace
        { token: 'text', foreground: '#D4D4D4' },
        { token: 'white', foreground: '#D4D4D4' },

        // Invalid tokens
        { token: 'invalid', foreground: '#FF5252', background: '#2D1B1B' },
    ],
    colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editorCursor.foreground': '#AEAFAD',
        'editor.lineHighlightBackground': '#2D2D30',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorWhitespace.foreground': '#404040',
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
    }
};


// Keep track of registrations to avoid duplicates
let isRegistered = false;

// Register the language, theme, and providers
export function registerPromptLanguage(monaco: any) {
    if (isRegistered) {
        return;
    }

    // Register language as completely new language
    monaco.languages.register({
        id: promptLanguageId,
        // extensions: ['.prompt'],
        aliases: ['Prompt Template', 'prompt-template']
    });

    // Set language configuration and tokenization rules
    monaco.languages.setLanguageConfiguration(promptLanguageId, promptLanguageConfiguration);
    monaco.languages.setMonarchTokensProvider(promptLanguageId, promptLanguageDefinition);

    // Register theme
    monaco.editor.defineTheme('afron-prompt-theme', promptTemplateTheme);

    isRegistered = true;
}