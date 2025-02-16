import type { ActRecord, } from '../src/types/ActRecord';
import type { CreateConReturnType, } from '../src/types/createConReturnType';
import type { DefaultSelector, } from '../src/types/DefaultSelector';
import type { DS, } from '../src/types/DS';
import type { Selector, } from '../src/types/Selector';

/**
 * Type definition for the return value of createConStore.
 * Combines the return type of createConBase with a function signature that accepts an optional selector.
 *
 * @typeParam {DS} S - The type of the state object
 * @typeParam {ActRecord} A - The type of the actions record
 */
export type CreateConStoreReturnType<
	S extends DS,
	AR extends ActRecord,
	Sel extends Selector<S, AR>,
> = CreateConReturnType<S, AR> & {
	(): ReturnType<Sel extends Selector<S, AR> ? Sel : DefaultSelector<S, AR>>
	<Sel extends Selector<S, AR>, >( select: Sel ): ReturnType<Sel>
};
