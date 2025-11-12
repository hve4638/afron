export type EError = { name: string, message: string, [key: string]: any };
export type EResult<T> = Promise<readonly [EError] | readonly [null, T]>;
export type ENoResult = Promise<readonly [EError | null]>;