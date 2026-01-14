import { PromptGenerator } from 'advanced-prompt-template-lang';
import { parseInputFileToCBFResult } from './utils';
import { InputFile } from '@afron/types';

class FilePromptGenerator extends PromptGenerator {
    #file: InputFile;

    constructor(file: InputFile) {
        super(function* () {
            yield parseInputFileToCBFResult(file);
        })

        this.#file = file;
    }

    get type() {
        return this.#file.type;
    }
}

export default FilePromptGenerator;