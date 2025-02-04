import { Draft } from "mutative";
import { strictDeepEqual } from "fast-equals";
type ActRecord = Record<string | number, (...args: never[]) => unknown>;
type EstadoArray = Array<unknown>;
type EstadoRecordKeyTypes = string | number;
type EstadoRecord = Record<EstadoRecordKeyTypes, unknown>;
type DS = EstadoRecord | EstadoArray;
type EstadoHistory<State extends DS> = {
    changes: (State extends Array<infer U> ? Array<U | undefined> : State extends EstadoRecord ? Partial<State> : never) | undefined;
    initial: State;
    priorState: State | undefined;
    priorInitial: State | undefined;
    state: State;
};
type GetArrayPathValue<T, K extends (string | number | symbol)[]> = K extends [infer First] ? First extends keyof T ? T[First] : never : K extends [infer First, ...infer Rest] ? First extends keyof T ? Rest extends (string | number | symbol)[] ? T[First] extends object ? GetArrayPathValue<T[First], Rest> : never : never : never : never;
type ToNumber<T extends string> = T extends `${infer N extends number}` ? N : never;
type SplitAtFirstUnescapedDot<Body extends string, A extends string = ''> = Body extends `${infer Head}.${infer Tail}` ? Head extends `${string}\\` ? Head extends `${infer B}\\` ? SplitAtFirstUnescapedDot<Tail, `${A}${B}.`> : never : Tail extends string ? [`${A}${Head}`, Tail] : [`${A}${Head}`, undefined] : [`${A}${Body}`, undefined];
type HeadAndShoulders<Body extends string | number | symbol> = Body extends number ? [Body, undefined] : Body extends string ? SplitAtFirstUnescapedDot<Body> extends [infer Head, infer Shoulders] ? [Head, Shoulders] : Body extends `${infer H}.${infer S}` ? [H, S] : never : [Body, undefined];
type Get<Obj, Head, Tail> = Head extends keyof Obj ? Obj[Head] extends Record<string | number, unknown> | Array<unknown> ? Tail extends string | number ? GetStringPathValue<Obj[Head], Tail> : Obj[Head] : Obj[Head] : Head extends `${number}` ? Obj extends Array<infer U> ? Tail extends string | number ? GetStringPathValue<U, Tail> : U : never : never;
type GetStringPathValue<Obj, Key extends string | number | symbol> = HeadAndShoulders<Key> extends [
    infer Head,
    infer Shoulders
] ? Head extends keyof Obj ? Get<Obj, Head, Shoulders> : Head extends `${number}` ? Get<Obj, ToNumber<Head>, Shoulders> : never : never;
type EscapeDots<S extends EstadoRecordKeyTypes> = S extends `${infer F}.${infer R}` ? `${F}\\.${EscapeDots<R>}` : `${S}`;
type RecordKeys = EstadoRecordKeyTypes | symbol;
type IsPlainObject<T> = T extends Record<RecordKeys, unknown> ? T extends Array<unknown> ? false : T extends Date ? false : T extends Set<unknown> ? false : T extends Map<unknown, unknown> ? false : T extends Function ? false : T extends RegExp ? false : true : false;
type ArrayIndexKey<T> = {
    [K in keyof T & number]: T[K] extends object ? `${K}` | `${K}.${NestedObjectKeys<T[K]>}` : never;
}[keyof T & number];
type RecordKey<T> = {
    [K in keyof T & (EstadoRecordKeyTypes)]: T[K] extends object ? EscapeDots<K> | `${EscapeDots<K>}.${NestedObjectKeys<T[K]>}` : never;
}[keyof T & (EstadoRecordKeyTypes)];
type NestedObjectKeys<T> = T extends DS ? T extends EstadoArray ? ArrayIndexKey<T> : IsPlainObject<T> extends true ? RecordKey<T> : never : never;
type _ArrayIndexKey1<T> = {
    [K in keyof T & number]: `${K}` | `${K}.${NestedRecordKeys<T[K]>}`;
}[keyof T & number];
type _RecordKey1<T> = {
    [K in keyof T & (EstadoRecordKeyTypes)]: EscapeDots<K> | `${EscapeDots<K>}.${NestedRecordKeys<T[K]>}`;
}[keyof T & (EstadoRecordKeyTypes)];
type NestedRecordKeys<T> = T extends DS ? T extends EstadoArray ? _ArrayIndexKey1<T> : IsPlainObject<T> extends true ? _RecordKey1<T> : never : never;
type StringPathToArray<T extends string> = T extends `${infer First}\\.${infer Rest}` ? [First, ...StringPathToArray<Rest>] : T extends `${infer First}.${infer Rest}` ? First extends `${number}` ? [number, ...StringPathToArray<Rest>] : [First, ...StringPathToArray<Rest>] : T extends `${number}` ? [number] : [T];
type SubArrayPath<State extends DS, Path> = Path extends ['state' | 'initial', ...infer Sub] ? Sub extends StringPathToArray<NestedObjectKeys<State>> ? Sub : never : never;
type StateArrayPathProps<State extends DS, TargetState extends DS, StatePath extends StringPathToArray<NestedObjectKeys<TargetState>>, Sub extends StringPathToArray<NestedObjectKeys<State>> = StringPathToArray<NestedObjectKeys<State>>> = {
    changesProp: GetArrayPathValue<EstadoHistory<State>['changes'], Sub>;
    initialProp: GetArrayPathValue<EstadoHistory<State>['initial'], Sub>;
    priorInitialProp: GetArrayPathValue<EstadoHistory<State>['priorInitial'], Sub>;
    priorStateProp: GetArrayPathValue<EstadoHistory<State>['priorState'], Sub>;
    stateProp: GetArrayPathValue<EstadoHistory<State>['state'], Sub>;
} & Readonly<{
    draft: GetArrayPathValue<Draft<TargetState>, StatePath>;
}> & EstadoHistory<State>;
type SubStringPath<State extends DS, Path> = Path extends `${'state' | 'initial'}.${infer Sub}` ? Sub extends NestedObjectKeys<State> ? Sub : never : never;
type GetStringPathPropValue<State extends DS, EHK extends keyof EstadoHistory<State>, Sub extends NestedObjectKeys<State>> = GetStringPathValue<EstadoHistory<State>[EHK], Sub>;
type NextStateStringPathProps<State extends DS, TargetState extends DS, StatePath extends NestedObjectKeys<TargetState>, Sub extends NestedObjectKeys<State>> = {
    changesProp: GetStringPathPropValue<State, 'changes', Sub>;
    initialProp: GetStringPathValue<EstadoHistory<State>['initial'], Sub>;
    priorInitialProp: GetStringPathValue<EstadoHistory<State>['priorInitial'], Sub>;
    priorStateProp: GetStringPathValue<EstadoHistory<State>['priorState'], Sub>;
    stateProp: GetStringPathValue<EstadoHistory<State>['state'], Sub>;
} & Readonly<{
    draft: GetStringPathValue<Draft<TargetState>, StatePath>;
}> & EstadoHistory<State>;
type NextState<State extends DS> = Pick<EstadoHistory<State>, 'state' | 'initial'>;
type EstadoSet<State extends DS, NS extends NextState<State> = NextState<State>> = {
    set(nextState: NS): EstadoHistory<State>;
    set(nextState: (props: EstadoHistory<State> & Readonly<{
        draft: Draft<NS>;
    }>) => void): EstadoHistory<State>;
    set<StatePath extends NestedObjectKeys<NS>>(statePath: StatePath, nextState: (props: NextStateStringPathProps<State, NS, StatePath, SubStringPath<State, StatePath>>) => void): EstadoHistory<State>;
    set<StatePath extends StringPathToArray<NestedObjectKeys<NS>>>(statePath: StatePath, nextState: (props: StateArrayPathProps<State, NS, StatePath, SubArrayPath<State, StatePath>>) => void): EstadoHistory<State>;
    set<StatePath extends StringPathToArray<NestedRecordKeys<NS>>>(statePath: StatePath, nextState: GetArrayPathValue<NS, StatePath> | ((props: {
        stateProp: GetArrayPathValue<NS, StatePath>;
        initialProp: GetArrayPathValue<NS, StatePath>;
        priorInitialProp: GetArrayPathValue<NS, StatePath>;
        priorStateProp: GetArrayPathValue<NS, StatePath>;
        changesProp: GetArrayPathValue<NS, StatePath>;
    }) => GetArrayPathValue<NS, StatePath>)): EstadoHistory<State>;
    set<StatePath extends NestedRecordKeys<NS>>(statePath: StatePath, nextState: GetStringPathValue<NS, StatePath> | ((props: EstadoHistory<State> & {
        stateProp: GetStringPathValue<NS, StatePath>;
        initialProp: GetStringPathValue<NS, StatePath>;
        priorInitialProp: GetStringPathValue<NS, StatePath>;
        priorStateProp: GetStringPathValue<NS, StatePath>;
        changesProp: GetStringPathValue<NS, StatePath>;
    }) => GetStringPathValue<NS, StatePath>)): EstadoHistory<State>;
};
type EstadoSetters<State extends DS> = {
    reset(): EstadoHistory<State>;
} & EstadoSet<State>;
type GetDraftRecord<State extends DS> = {
    getDraft(stateHistoryPath?: undefined): [
        Draft<Pick<EstadoHistory<State>, 'state' | 'initial'>>,
        () => EstadoHistory<State>
    ];
    getDraft<StateHistoryPath extends NestedObjectKeys<Pick<EstadoHistory<State>, 'state' | 'initial'>>>(stateHistoryPath: StateHistoryPath): [
        GetStringPathValue<Draft<Pick<EstadoHistory<State>, 'state' | 'initial'>>, StateHistoryPath>,
        () => EstadoHistory<State>
    ];
};
type Immutable<T> = T extends (infer R)[] ? ReadonlyArray<Immutable<R>> : T extends Function ? T : T extends object ? {
    readonly [P in keyof T]: Immutable<T[P]>;
} : T;
type CreateActsProps<State extends DS> = {
    get(stateHistoryPath?: undefined): Immutable<EstadoHistory<State>>;
    get<StateHistoryPath extends NestedRecordKeys<EstadoHistory<State>>>(stateHistoryPath: StateHistoryPath): Immutable<GetStringPathValue<EstadoHistory<State>, StateHistoryPath>>;
} & GetDraftRecord<State> & EstadoSetters<State>;
type EstadoProps<State extends DS, Acts extends ActRecord> = CreateActsProps<State> & {
    acts: Acts;
};
type Selector<State extends DS, Acts extends ActRecord, R = unknown> = (selectorProps: EstadoProps<State, Acts> & Immutable<EstadoHistory<State>>) => R;
declare function defaultSelector<State extends DS, Acts extends ActRecord>(selectorProps: Parameters<Selector<State, Acts>>[0]): readonly [Immutable<State>, {
    get(stateHistoryPath?: undefined): {
        readonly changes: Immutable<State extends (infer U)[] ? (U | undefined)[] : State extends EstadoRecord ? Partial<State> : never> | undefined;
        readonly initial: Immutable<State>;
        readonly priorState: Immutable<State> | undefined;
        readonly priorInitial: Immutable<State> | undefined;
        readonly state: Immutable<State>;
    };
    get<StateHistoryPath extends "state" | "initial" | "changes" | "priorInitial" | "priorState" | `state.${NestedRecordKeys<State>}` | `initial.${NestedRecordKeys<State>}` | `changes.${NestedRecordKeys<State extends (infer U)[] ? (U | undefined)[] : State extends EstadoRecord ? Partial<State> : never>}` | `priorInitial.${NestedRecordKeys<State>}` | `priorState.${NestedRecordKeys<State>}`>(stateHistoryPath: StateHistoryPath): Immutable<GetStringPathValue<EstadoHistory<State>, StateHistoryPath>>;
} & GetDraftRecord<State> & {
    reset(): EstadoHistory<State>;
} & {
    set(nextState: {
        state: State;
        initial: State;
    }): EstadoHistory<State>;
    set(nextState: (props: EstadoHistory<State> & Readonly<{
        draft: {
            state: Draft<State>;
            initial: Draft<State>;
        };
    }>) => void): EstadoHistory<State>;
    set<StatePath extends (State extends object ? "state" | `state.${NestedObjectKeys<State>}` : never) | (State extends object ? "initial" | `initial.${NestedObjectKeys<State>}` : never)>(statePath: StatePath, nextState: (props: {
        changesProp: GetStringPathValue<(State extends (infer U)[] ? (U | undefined)[] : State extends EstadoRecord ? Partial<State> : never) | undefined, StatePath extends `state.${infer Sub}` | `initial.${infer Sub}` ? Sub extends NestedObjectKeys<State> ? Sub : never : never>;
        initialProp: GetStringPathValue<State, StatePath extends `state.${infer Sub}` | `initial.${infer Sub}` ? Sub extends NestedObjectKeys<State> ? Sub : never : never>;
        priorInitialProp: GetStringPathValue<State | undefined, StatePath extends `state.${infer Sub}` | `initial.${infer Sub}` ? Sub extends NestedObjectKeys<State> ? Sub : never : never>;
        priorStateProp: GetStringPathValue<State | undefined, StatePath extends `state.${infer Sub}` | `initial.${infer Sub}` ? Sub extends NestedObjectKeys<State> ? Sub : never : never>;
        stateProp: GetStringPathValue<State, StatePath extends `state.${infer Sub}` | `initial.${infer Sub}` ? Sub extends NestedObjectKeys<State> ? Sub : never : never>;
    } & Readonly<{
        draft: GetStringPathValue<{
            state: Draft<State>;
            initial: Draft<State>;
        }, StatePath>;
    }> & EstadoHistory<State>) => void): EstadoHistory<State>;
    set<StatePath extends StringPathToArray<State extends object ? "state" | `state.${NestedObjectKeys<State>}` : never> | StringPathToArray<State extends object ? "initial" | `initial.${NestedObjectKeys<State>}` : never>>(statePath: StatePath, nextState: (props: StateArrayPathProps<State, {
        state: State;
        initial: State;
    }, StatePath, StatePath extends ["state" | "initial", ...infer Sub] ? Sub extends StringPathToArray<NestedObjectKeys<State>> ? Sub : never : never>) => void): EstadoHistory<State>;
    set<StatePath extends ["state"] | ["initial"] | StringPathToArray<`state.${NestedRecordKeys<State>}`> | StringPathToArray<`initial.${NestedRecordKeys<State>}`>>(statePath: StatePath, nextState: GetArrayPathValue<{
        state: State;
        initial: State;
    }, StatePath> | ((props: {
        stateProp: GetArrayPathValue<{
            state: State;
            initial: State;
        }, StatePath>;
        initialProp: GetArrayPathValue<{
            state: State;
            initial: State;
        }, StatePath>;
        priorInitialProp: GetArrayPathValue<{
            state: State;
            initial: State;
        }, StatePath>;
        priorStateProp: GetArrayPathValue<{
            state: State;
            initial: State;
        }, StatePath>;
        changesProp: GetArrayPathValue<{
            state: State;
            initial: State;
        }, StatePath>;
    }) => GetArrayPathValue<{
        state: State;
        initial: State;
    }, StatePath>)): EstadoHistory<State>;
    set<StatePath extends "state" | "initial" | `state.${NestedRecordKeys<State>}` | `initial.${NestedRecordKeys<State>}`>(statePath: StatePath, nextState: GetStringPathValue<{
        state: State;
        initial: State;
    }, StatePath> | ((props: EstadoHistory<State> & {
        stateProp: GetStringPathValue<{
            state: State;
            initial: State;
        }, StatePath>;
        initialProp: GetStringPathValue<{
            state: State;
            initial: State;
        }, StatePath>;
        priorInitialProp: GetStringPathValue<{
            state: State;
            initial: State;
        }, StatePath>;
        priorStateProp: GetStringPathValue<{
            state: State;
            initial: State;
        }, StatePath>;
        changesProp: GetStringPathValue<{
            state: State;
            initial: State;
        }, StatePath>;
    }) => GetStringPathValue<{
        state: State;
        initial: State;
    }, StatePath>)): EstadoHistory<State>;
} & {
    acts: Acts;
} & {
    readonly changes: Immutable<State extends (infer U)[] ? (U | undefined)[] : State extends EstadoRecord ? Partial<State> : never> | undefined;
    readonly initial: Immutable<State>;
    readonly priorState: Immutable<State> | undefined;
    readonly priorInitial: Immutable<State> | undefined;
    readonly state: Immutable<State>;
}];
type CreateActs<State extends DS, Acts extends ActRecord> = (createActsProps: CreateActsProps<State>) => Acts;
type OptionAfterChange<State extends DS> = (estadoHistory: Immutable<EstadoHistory<State>>) => Promise<void> | void;
type ArrayKeys<T> = {
    [K in keyof T & number]: [K] | [...[K], ...NestedKeyArray<T[K]>];
}[keyof T & number];
type RecordArrayKeys<T> = {
    [K in keyof T]: [K] | [...[K], ...NestedKeyArray<T[K]>];
}[keyof T];
type NestedKeyArray<T> = T extends DS ? T extends EstadoArray ? ArrayKeys<T> : IsPlainObject<T> extends true ? RecordArrayKeys<T> : never : never;
/**
 * A `function` type for custom comparing the previous and next values of a hook state key.
 * Useful for the following scenarios:
 * - Custom equality logic by comparing only specific properties to optimize re-renders.
 * - Handle complex nested objects that need special comparison handling.
 * @template {DS} State - The {@link DS} hook state.
 * @param previous - A previous value.
 * @param next - A next value.
 * @param extra - An object containing additional parameters for the comparison:
 * @param extra.cmp - A comparison function using {@link import('fast-equals').strictDeepEqual strictDeepEqual}
 * from {@link import('fast-equals') fast-equals} library.
 * @param extra.key - string that leads to a nested state's value.
 * @param extra.keys - An array of keys that lead to a nested state's value.
 * @returns `true` if the previous and next values are considered equal, `false` otherwise.
 */
type OptionCompare<State extends DS> = (previousValue: unknown, nextValue: unknown, extra: {
    cmp: typeof strictDeepEqual;
    key: NestedRecordKeys<State> | NestedRecordKeys<Pick<EstadoHistory<State>, 'state' | 'initial'>>;
    keys: NestedKeyArray<State> | StringPathToArray<NestedRecordKeys<Pick<EstadoHistory<State>, 'state' | 'initial'>>>;
}) => boolean;
type Option<State extends DS, Acts extends ActRecord> = {
    compare?: OptionCompare<State>;
    afterChange?: OptionAfterChange<State>;
    dispatcher?: (history: Immutable<EstadoHistory<State>>) => void;
    acts?: CreateActs<State, Acts>;
};
type UseEstadoProps<State extends DS, Acts extends ActRecord> = Omit<Option<State, Acts>, 'dispatcher'> & {
    selector?: Selector<State, Acts>;
};
export function createConStore<State extends DS, Acts extends ActRecord>(initial: State, options?: UseEstadoProps<State, Acts>): {
    (): ReturnType<typeof defaultSelector<State, Acts>>;
    <Sel extends Selector<State, Acts>>(select: Sel): ReturnType<Sel>;
} & {
    acts: Acts;
    get: {
        (stateHistoryPath?: undefined): {
            readonly changes: Immutable<State extends (infer U)[] ? (U | undefined)[] : State extends EstadoRecord ? Partial<State> : never> | undefined;
            readonly initial: Immutable<State>;
            readonly priorState: Immutable<State> | undefined;
            readonly priorInitial: Immutable<State> | undefined;
            readonly state: Immutable<State>;
        };
        <StateHistoryPath extends "state" | "initial" | "changes" | "priorInitial" | "priorState" | `state.${NestedRecordKeys<State>}` | `initial.${NestedRecordKeys<State>}` | `changes.${NestedRecordKeys<State extends (infer U)[] ? (U | undefined)[] : State extends EstadoRecord ? Partial<State> : never>}` | `priorInitial.${NestedRecordKeys<State>}` | `priorState.${NestedRecordKeys<State>}`>(stateHistoryPath: StateHistoryPath): Immutable<GetStringPathValue<EstadoHistory<State>, StateHistoryPath>>;
    };
    getDraft: {
        (stateHistoryPath?: undefined): [{
            state: Draft<State>;
            initial: Draft<State>;
        }, () => EstadoHistory<State>];
        <StateHistoryPath extends (State extends object ? "state" | `state.${NestedObjectKeys<State>}` : never) | (State extends object ? "initial" | `initial.${NestedObjectKeys<State>}` : never)>(stateHistoryPath: StateHistoryPath): [GetStringPathValue<{
            state: Draft<State>;
            initial: Draft<State>;
        }, StateHistoryPath>, () => EstadoHistory<State>];
    };
    reset: () => EstadoHistory<State>;
    set: {
        (nextState: {
            state: State;
            initial: State;
        }): EstadoHistory<State>;
        (nextState: (props: EstadoHistory<State> & Readonly<{
            draft: {
                state: Draft<State>;
                initial: Draft<State>;
            };
        }>) => void): EstadoHistory<State>;
        <StatePath extends (State extends object ? "state" | `state.${NestedObjectKeys<State>}` : never) | (State extends object ? "initial" | `initial.${NestedObjectKeys<State>}` : never)>(statePath: StatePath, nextState: (props: {
            changesProp: GetStringPathValue<(State extends (infer U)[] ? (U | undefined)[] : State extends EstadoRecord ? Partial<State> : never) | undefined, StatePath extends `state.${infer Sub}` | `initial.${infer Sub}` ? Sub extends NestedObjectKeys<State> ? Sub : never : never>;
            initialProp: GetStringPathValue<State, StatePath extends `state.${infer Sub}` | `initial.${infer Sub}` ? Sub extends NestedObjectKeys<State> ? Sub : never : never>;
            priorInitialProp: GetStringPathValue<State | undefined, StatePath extends `state.${infer Sub}` | `initial.${infer Sub}` ? Sub extends NestedObjectKeys<State> ? Sub : never : never>;
            priorStateProp: GetStringPathValue<State | undefined, StatePath extends `state.${infer Sub}` | `initial.${infer Sub}` ? Sub extends NestedObjectKeys<State> ? Sub : never : never>;
            stateProp: GetStringPathValue<State, StatePath extends `state.${infer Sub}` | `initial.${infer Sub}` ? Sub extends NestedObjectKeys<State> ? Sub : never : never>;
        } & Readonly<{
            draft: GetStringPathValue<{
                state: Draft<State>;
                initial: Draft<State>;
            }, StatePath>;
        }> & EstadoHistory<State>) => void): EstadoHistory<State>;
        <StatePath extends StringPathToArray<State extends object ? "state" | `state.${NestedObjectKeys<State>}` : never> | StringPathToArray<State extends object ? "initial" | `initial.${NestedObjectKeys<State>}` : never>>(statePath: StatePath, nextState: (props: StateArrayPathProps<State, {
            state: State;
            initial: State;
        }, StatePath, StatePath extends ["state" | "initial", ...infer Sub] ? Sub extends StringPathToArray<NestedObjectKeys<State>> ? Sub : never : never>) => void): EstadoHistory<State>;
        <StatePath extends ["state"] | ["initial"] | StringPathToArray<`state.${NestedRecordKeys<State>}`> | StringPathToArray<`initial.${NestedRecordKeys<State>}`>>(statePath: StatePath, nextState: GetArrayPathValue<{
            state: State;
            initial: State;
        }, StatePath> | ((props: {
            stateProp: GetArrayPathValue<{
                state: State;
                initial: State;
            }, StatePath>;
            initialProp: GetArrayPathValue<{
                state: State;
                initial: State;
            }, StatePath>;
            priorInitialProp: GetArrayPathValue<{
                state: State;
                initial: State;
            }, StatePath>;
            priorStateProp: GetArrayPathValue<{
                state: State;
                initial: State;
            }, StatePath>;
            changesProp: GetArrayPathValue<{
                state: State;
                initial: State;
            }, StatePath>;
        }) => GetArrayPathValue<{
            state: State;
            initial: State;
        }, StatePath>)): EstadoHistory<State>;
        <StatePath extends "state" | "initial" | `state.${NestedRecordKeys<State>}` | `initial.${NestedRecordKeys<State>}`>(statePath: StatePath, nextState: GetStringPathValue<{
            state: State;
            initial: State;
        }, StatePath> | ((props: EstadoHistory<State> & {
            stateProp: GetStringPathValue<{
                state: State;
                initial: State;
            }, StatePath>;
            initialProp: GetStringPathValue<{
                state: State;
                initial: State;
            }, StatePath>;
            priorInitialProp: GetStringPathValue<{
                state: State;
                initial: State;
            }, StatePath>;
            priorStateProp: GetStringPathValue<{
                state: State;
                initial: State;
            }, StatePath>;
            changesProp: GetStringPathValue<{
                state: State;
                initial: State;
            }, StatePath>;
        }) => GetStringPathValue<{
            state: State;
            initial: State;
        }, StatePath>)): EstadoHistory<State>;
    };
};
export function useCon<State extends DS, Acts extends ActRecord, Sel extends Selector<State, Acts>>(initial: State, options: UseEstadoProps<State, Acts> & {
    selector: Sel;
}): ReturnType<Sel>;
export function useCon<State extends DS, Acts extends ActRecord>(initial: State, options?: Omit<UseEstadoProps<State, Acts>, 'selector'>): ReturnType<typeof defaultSelector<State, Acts>>;

//# sourceMappingURL=types.d.ts.map
