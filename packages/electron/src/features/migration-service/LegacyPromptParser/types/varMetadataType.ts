import { PROMPT_VAR_TYPE } from '../data';

/** @legacy */
export type BaseVarMetadata = {
    type: string;
    name: string;
    display_name: string;
    default_value: any;
    show_in_header: boolean;
}

/** @legacy */
export type SelectVarMetadata = BaseVarMetadata & {
    type: typeof PROMPT_VAR_TYPE.SELECT;
    select_ref?: string;
    // 이전 포맷과 호환성을 위해 존재
    selectref?: string;
    options?: SelectItem[];
}

/** @legacy */
export type LiteralVarMetadata = BaseVarMetadata & {
    type: typeof PROMPT_VAR_TYPE.TEXT | typeof PROMPT_VAR_TYPE.TEXT_MULTILINE | typeof PROMPT_VAR_TYPE.NUMBER | typeof PROMPT_VAR_TYPE.BOOLEAN;
}

/** @legacy */
export type ArrayVarMetadata = BaseVarMetadata & {
    type: typeof PROMPT_VAR_TYPE.ARRAY;
    element: VarMetadata;
}

/** @legacy */
export type StructVarMetadata = BaseVarMetadata & {
    type: typeof PROMPT_VAR_TYPE.STRUCT;
    fields: NestableVarMetadata[];
}

/** @legacy */
export type ImageVarMetadata = BaseVarMetadata & {
    type: typeof PROMPT_VAR_TYPE.IMAGE;
}

/** @legacy */
export type VarMetadata = SelectVarMetadata | LiteralVarMetadata | ArrayVarMetadata | StructVarMetadata;

/** @legacy */
export type NestableVarMetadata = SelectVarMetadata | LiteralVarMetadata;

/** @legacy */
export type Selects = {
    [refname:string]: SelectItem[];
}

/** @legacy */
export type SelectItem = {
    name:string;
    value:string;
}

/** @legacy */
export type ArrayElementMetadata = Omit<VarMetadata, 'name'|'display_name'|'type'>;