import type { ActRecord, } from './ActRecord';
import type { DefaultSelector, } from './DefaultSelector';
import type { DS, } from './DS';
import type { Selector, } from './Selector';

type DefaultUseSelector<
	S extends DS,
	AR extends ActRecord,
> = {
	useSelector: () => ReturnType<DefaultSelector<S, AR, DefaultUseSelector<S, AR>>>
};

type UseSelectorParam<
	S extends DS,
	AR extends ActRecord,
> = {
	useSelector: <Sel extends Selector<S, AR, UseSelectorParam<S, AR>>, >( select: Sel ) => ReturnType<Sel>
};

export type UseSelectorProp<
	S extends DS,
	AR extends ActRecord,
> = {
	(): ReturnType<DefaultSelector<S, AR, DefaultUseSelector<S, AR>>>
	<Sel extends Selector<S, AR, UseSelectorParam<S, AR>>, >( select: Sel ): ReturnType<Sel>
};
