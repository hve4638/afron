const pattern_say = /^(.*)(["][^"]*["])(.*)/
const pattern_accent = /^(.*)(['][^']*['])(.*)/
const pattern_think = /^(.*)([*][^*]*[*])(.*)/
const pattern_plain = /^([^"*]+)(["*].*)/

export const splitByQuotes = (text: string) => {
    const parts: string[] = [];

    const tryMatchAndAddParts = (pattern: RegExp) => {
        const group = pattern.exec(text);

        if (group) {
            const [, prefix, matched, postfix] = group;
            if (prefix !== '') parts.push(prefix);
            parts.push(matched);
            text = postfix;

            return true;
        }
        else {
            return false;
        }
    }
    const AddRemainder = () => {
        parts.push(text);
        text = '';
        return true;
    }

    while (text !== '') {
        if (tryMatchAndAddParts(pattern_say)
            || tryMatchAndAddParts(pattern_accent)
            || tryMatchAndAddParts(pattern_think)
            || tryMatchAndAddParts(pattern_plain)
            || AddRemainder()
        ) continue;
    }

    return parts;
}