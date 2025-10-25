import { RTVarData } from './var-data';

/**
 * RTVar 생성 타입 정의
 * 
 * 기존 PromptVar과 비교해 id 필드의 유무로 생성 구분
 */
export type RTVarCreate = (
    RTExternalCreate
    | RTConstantCreate
    | RTFormCreate
);

export type BaseRTVarCreate = {
    name: string;
}

export interface RTExternalCreate extends BaseRTVarCreate {
    include_type: 'external';
    external_id: string;
}
export interface RTConstantCreate extends BaseRTVarCreate {
    include_type: 'constant';
    value: any;
}
export type RTFormCreate = BaseRTVarCreate & {
    include_type: 'form';
} & (
        {
            // form_id가 없는 경우 새로운 form 생성
            form_id?: undefined | null;
            form_name?: string;
            // 생성한 form의 RTVarData 정의
            data: RTVarData;
        } | {
            // form_id가 있으면 존재하는 form을 참조
            form_id: string;
        }
    )