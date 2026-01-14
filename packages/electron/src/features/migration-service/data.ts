import path from 'node:path';
import { app } from 'electron';

export const DOCUMENT_PATH = app.getPath('documents');
export const AIFRONT_PATH = path.join(DOCUMENT_PATH, 'AIFront');
export const HISTORY_PATH = path.join(AIFRONT_PATH, 'history');
export const PROMPT_DIR_PATH = path.join(AIFRONT_PATH, 'prompts');
export const CONFIG_FILE_PATH = path.join(AIFRONT_PATH, 'config.json');