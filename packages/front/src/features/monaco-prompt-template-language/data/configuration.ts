
// Language configuration
export const CONFIGURATION = {
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