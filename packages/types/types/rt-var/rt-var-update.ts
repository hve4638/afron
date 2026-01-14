import { RTVarData } from './var-data';

/**
 * RTVar 갱신 타입 정의
 * 
 * id 필드의 유무에 따라 갱신 구분
 */
export type RTVarUpdate = (
    RTVarIncludePreserveUpdate
    | RTVarExternalUpdate
    | RTVarConstantUpdate
    | RTVarFormUpdate
);

export type BaseRTVarUpdate = {
    id: string;
    name?: string;
}

export interface RTVarExternalUpdate extends BaseRTVarUpdate {
    include_type: 'external';
    external_id: string;
}
export interface RTVarConstantUpdate extends BaseRTVarUpdate {
    include_type: 'constant';
    value: any;
}
export type RTVarFormUpdate = BaseRTVarUpdate & {
    include_type: 'form';
} & (
        {
            // form_id가 없는 경우 새로운 form 생성
            form_id?: undefined | null;
            form_name?: string;
            data: RTVarData;
        } | {
            // form_id가 있으면 기존 form 갱신
            form_id: string;
            form_name?: string;
            data?: RTVarData;
        }
    )
type RTVarIncludePreserveUpdate = BaseRTVarUpdate & {
    include_type?: undefined;
}