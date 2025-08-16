import { isText } from 'istextorbinary';

export function isTextData(base64Data: string): boolean {
    const buffer = Buffer.from(base64Data, 'base64');
    return isText(null, buffer)!;
}