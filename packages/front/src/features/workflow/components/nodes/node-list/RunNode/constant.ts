import { RTFlowNodeOptions } from '@afron/types';

export const DEFAULT_RUN_NODE_DATA: RTFlowNodeOptions.RTStart = {
    start_trigger: 'start',
    button_label: 'Start',
    include_chat_history: false,
    allow_input_text: true,
    allow_input_image: false,
    allow_input_pdf: false,
    allow_input_files: false,
};