// Custom theme for prompt template language
export const THEME = {
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

