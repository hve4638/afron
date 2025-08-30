
export const DEFINITION = {
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