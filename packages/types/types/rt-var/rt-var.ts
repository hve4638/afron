import { RTVarData } from './var-data';

/**
 * backend -> frontend 넘겨주는 RTVar 타입 정의
 */
export type RTVar = (
    RTVarExternal
    | RTVarConstant
    | RTVarForm
    | RTVarUnknown
);

export type BaseRTVar = {
    id: string;
    name: string;
}

export interface RTVarExternal extends BaseRTVar {
    include_type: 'external';
    external_id: string;
}
export interface RTVarConstant extends BaseRTVar {
    include_type: 'constant';
    value: any;
}
export type RTVarForm = BaseRTVar & {
    include_type: 'form';
    form_id: string;
    form_name: string;
    // form_id가 가지고 있는 RTVarData 참조를 함께 리턴
    data: RTVarData;
}
// 외부 소스가 사라진 경우 unknown으로 처리
export type RTVarUnknown = BaseRTVar & {
    include_type: 'unknown';
}