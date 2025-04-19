import type { ActRecord, } from '../types/ActRecord';
import type { DefaultSelector, } from '../types/DefaultSelector';
import type { DS, } from '../types/DS';

/**
 * Default selector function used when no custom selector is provided
 *
 * @template S - The data structure type extending DS
 * @template AR - Action Record type defining custom action handlers
 * @template SP - Additional selector props type, defaults to empty record
 *
 * @param {Parameters<DefaultSelector<S, AR, SP>>[0]} selectorProps - Props containing state and control methods
 *
 * @returns {[S, Parameters<DefaultSelector<S, AR, SP>>[0]]} Tuple containing state and all selector props
 *
 * @remarks
 * This is the default implementation used by createConStore and useCon when no custom selector is provided.
 * It returns a tuple where the first element is the state and the second element contains all control methods.
 *
 * @example
 * ```ts
 * // This is equivalent to the default behavior:
 * const useStore = createConStore(
 *   { count: 0 },
 *   (props) => [props.state, props]
 * );
 *
 * // Usage in component:
 * const [state, { set, commit }] = useStore();
 * ```
 *
 * @internal
 */
export default function defaultSelector<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown> | Record<never, never> = Record<never, never>,
>( selectorProps: Parameters<DefaultSelector<S, AR, SP>>[0], ) {
	return [
		selectorProps.state,
		selectorProps,
	] as const;
}
