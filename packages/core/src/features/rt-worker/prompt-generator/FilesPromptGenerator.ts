import { PromptGenerator } from 'advanced-prompt-template-lang';
import FilePromptGenerator from './FilePromptGenerator';
import { parseInputFileToCBFResult } from './utils';
import { InputFile } from '@afron/types';

class FilesPromptGenerator extends PromptGenerator {
    #files: InputFile[];

    constructor(files: InputFile[] = []) {
        super(function* () {
            for (const file of files) {
                yield parseInputFileToCBFResult(file);
            }
        })

        this.#files = files;
    }

    get length(): number {
        return this.#files.length;
    }

    indexor(index: number): FilePromptGenerator {
        if (index < 0 || index >= this.#files.length) {
            throw new Error(`Index out of bounds: ${index}`);
        }
        return new FilePromptGenerator(this.#files[index]);
    }
}

export default FilesPromptGenerator;