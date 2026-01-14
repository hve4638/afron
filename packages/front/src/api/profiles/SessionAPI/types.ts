import { ProfileStorageSchema } from '@afron/types';

export interface SessionAccessorSchemaMap {
    'cache.json': ProfileStorageSchema.Session.Cache;
    'config.json': ProfileStorageSchema.Session.Config;
    'data.json': ProfileStorageSchema.Session.Data;
}

export type SessionAccessorId = keyof SessionAccessorSchemaMap;

/**
 * 스키마의 특정 키들만 선택하여 Partial 형태로 반환하는 타입
 *
 * @example
 * SessionAccessorResult<'cache.json', 'rtId' | 'flowId'>
 * -> { rtId: string; flowId: string }
 *
 * SessionAccessorResult<'data.json', 'messages'>
 * -> { messages: Message[] }
 */
export type SessionAccessorResult<
    A extends SessionAccessorId,
    K extends keyof SessionAccessorSchemaMap[A]
> = PartialPick<SessionAccessorSchemaMap[A], K>;

type PartialPick<T, K extends keyof T> = {
    [P in K]: T[P];
};

/**
 * 스키마의 일부 필드를 업데이트하기 위한 타입
 *
 * @example
 * SessionAccessorInput<'cache.json'>
 * -> { rtId?: string; flowId?: string; ... }
 *
 * SessionAccessorInput<'config.json'>
 * -> { title?: string; createdAt?: number; ... }
 */
export type SessionAccessorInput<A extends SessionAccessorId> =
    Partial<SessionAccessorSchemaMap[A]>;
