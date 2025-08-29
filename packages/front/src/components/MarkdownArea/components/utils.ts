export type CodeElement = {
    type: 'text';
    value: string;
} | {
    type: 'element';
    tagName: string;
    children: CodeElement[];
}

export function parseCodeToText(element: CodeElement) {
    if (element.type === 'text') {
        return element.value;
    }
    else if (element.type === 'element') {
        return element.children.map(parseCodeToText).join('');
    }
}