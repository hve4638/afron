const TEXT_MIMES = [
    'text/plain',
    'text/html',
    'text/css',
    'text/csv',
    'text/javascript',
    'text/calendar',
    'text/xml',
    'application/json',
    'application/ld+json',
    'application/xml',
    'application/xhtml+xml',
    'application/vnd.apple.installer+xml',
    'application/vnd.mozilla.xul+xml',
    'application/x-csh',
    'application/x-sh',
    'application/x-httpd-php',
    'image/svg+xml'
];

const IMAGE_MIMES = [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'image/bmp',
];

/** mime 타입으로 텍스트 여부 판정 */
export function isTextMIME(mimeType: string): boolean {
    return TEXT_MIMES.includes(mimeType);
}

export function isImageMIME(mimeType: string): boolean {
    return IMAGE_MIMES.includes(mimeType);
}