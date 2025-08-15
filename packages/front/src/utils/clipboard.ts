// pasteImage.ts
export type PasteImageResult = { isImage: true; file: File } | { isImage: false };

export  function readImageFromClipboard(
    e: React.ClipboardEvent
): PasteImageResult {
    const cd = e.clipboardData;
    if (!cd) return { isImage: false };

    for (const item of cd.files) {
        if (item.type.startsWith('image/')) {
            return { isImage: true, file: item };
        }
    }

    return { isImage: false };
}
