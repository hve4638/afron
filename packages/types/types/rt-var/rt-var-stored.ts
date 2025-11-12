/**
 * backend에서 저장되는 형식
 */
export type RTVarStored = (
    RTVarStoredExternal
    | RTVarStoredConstant
    | RTVarStoredForm
    | RTVarStoredUnknown
);

export type BaseRTVarStored = {
    id: string;
    name: string;
}

interface RTVarStoredExternal extends BaseRTVarStored {
    include_type: 'external';
    external_id: string;
}
interface RTVarStoredConstant extends BaseRTVarStored {
    include_type: 'constant';
    value: any;
}
type RTVarStoredForm = BaseRTVarStored & {
    include_type: 'form';
    form_id: string;
}
type RTVarStoredUnknown = BaseRTVarStored & {
    include_type: 'unknown';
}