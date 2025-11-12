import { HandleTypes } from './types';

/**
 * 어떤 Handle이 다른 Handle과 연결될 수 있는지 정의
 * 
 * 동일 Handle끼리는 연결 가능하므로 별도 정의하지 않음
 * 
 * key는 output이며, 연결가능한 input Handle 목록을 배열로 정의
*/
export const HandleCompatibility: Record<string, HandleTypes[]> = {
    [HandleTypes.Output]: [HandleTypes.LLMResult],
}
