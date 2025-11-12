import { Ping } from '@/lib/zustbus';

export type VarEditModalControlEvent = {
    open_struct_field_editor: { fieldName: string; };
    open_array_element_editor: Ping;
    close_2rd_editor: Ping;

    close_modal: Ping;
}