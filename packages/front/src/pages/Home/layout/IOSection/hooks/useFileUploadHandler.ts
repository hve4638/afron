import { useEvent } from '@/hooks/useEvent';
import useSessionStore from '@/stores/useSessionStore';

import { readFileAsDataURI } from '@/utils/file';


function useFileUploadHandler() {
    const { last_session_id, api } = useSessionStore(state => state.deps);
    const input_files = useSessionStore(state => state.input_files);
    const cached_thumbnails = useSessionStore(state => state.cached_thumbnails);

    useEvent('input_file_upload', async ({ file, latch }) => {
        const data = await readFileAsDataURI(file);

        const metadata = await api.session(last_session_id!).inputFiles.add(file.name, data);
        const next: InputFilePreview[] = [
            ...input_files,
            {
                filename: metadata.filename,
                size: metadata.size,
                type: metadata.type,
                hash_sha256: metadata.hash_sha256,
                thumbnail: metadata.thumbnail,
            }
        ];
        cached_thumbnails[metadata.hash_sha256] = metadata.thumbnail;
        useSessionStore.setState({ input_files: next });

        latch.release();
    }, [input_files, cached_thumbnails], last_session_id !== undefined);
}

export default useFileUploadHandler;