import type { DS, } from './DS';

export type Initial<
	S extends DS,
> = S | ( () => S );
