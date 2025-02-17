import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { Selector, } from './Selector';

/**
 * A specialized selector type that returns a tuple containing the current state and selector props.
 * Useful for accessing both raw state and computed values in components.
 *
 * @template S - The state type
 * @template AR - Action record type
 * @template P - Parameter type derived from base Selector parameters
 * @returns {readonly [P['state'], P]} Tuple of [current state, selector props]
 *
 */
export type DefaultSelector<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown>,
	P extends Parameters<Selector<S, AR, SP>>[0] = Parameters<Selector<S, AR, SP>>[0],
> = Selector<
	S,
	AR,
	SP,
	readonly [
		P['state'],
		P,
	]
>;
