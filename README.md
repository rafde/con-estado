# con-estado

[![NPM License](https://img.shields.io/npm/l/con-estado)](/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/con-estado)](https://www.npmjs.com/package/con-estado)
[![JSR Version](https://img.shields.io/jsr/v/%40rafde/con-estado)](https://jsr.io/@rafde/con-estado)
![Test](https://github.com/rafde/con-estado/actions/workflows/test.yml/badge.svg)

## Docs
For full documentation, with details and examples, see [con-estado docs](https://rafde.github.io/con-estado).

## Installation

```shell
npm i con-estado
```

```shell
yarn add con-estado
```

```shell
deno add jsr:@rafde/con-estado
```

## Introduction

`con-estado` is a state management library built on top of [Mutative](https://mutative.js.org/),
like [Immer](https://immerjs.github.io/immer/) but faster,
with the goal of helping with deeply nested state management.

With TypeScript support, strongly infers as much as it can for state 
and callback functions so you can use type-safe selectors and actions.

## Why Use `con-estado`?

Managing deeply nested state in React often becomes cumbersome with traditional state management solutions. `con-estado` provides:

- **Direct path updates**: Modify nested properties using dot-notation or `Array<string | number>` instead of spreading multiple levels
- **Referential stability**: Only modified portions of state create new references, preventing unnecessary re-renders
- **Custom selectors**: Prevent component re-renders by selecting only relevant state fragments
- **Type-safe mutations**: Full TypeScript support for state paths and updates

Built on [Mutative](https://mutative.js.org/)'s efficient immutable updates, `con-estado` is particularly useful for applications with:
- Complex nested state structures
- Performance-sensitive state operations
- Frequent partial state updates
- Teams wanting to reduce state management boilerplate

## Basic Usage

```tsx
import { useCon } from 'con-estado';
// Define your initial state
const initialState = {
  user: {
    name: 'John',
    preferences: {
      theme: 'dark' as 'dark' | 'light',
      notifications: {
        email: true,
        push: false,
      },
    },
  },
  // since it's empty, you have to assert its type
  posts: [] as Post[],
};

function MyComponent() {
  const [
    state,
    { setWrap, acts, }
  ] = useCon( 
    initialState,
    {
      acts: ( { set, }, ) => ( {
        onChangeInput: ( event: ChangeEvent<HTMLInputElement>, ) => {
          set( event.target.name as Parameter<typeof set>[0], event.target.value )
        }
      })
    }
  );

  return <div>
    <h1>
      Welcome {state.user.name}
    </h1>
    <input
      type="text"
      name="user.name"
      value={state.user.name}
      onChange={acts.onChangeInput}
    />
    <button onClick={setWrap(
      'user.preferences.notifications.email',
      (props) => props.draft = !props.draft
    )}>
      Toggle Email Notifications
    </button>
  </div>;
}
```
## Global Store

For applications needing global state management, `createConStore` provides a solution for creating actions and optimized updates:

```tsx
import { createConStore, } from 'con-estado';

type CounterState = {
  count: number
}

const useSelector = createConStore<CounterState>(
  { count: 0, },
  {
    acts: ( { set, setWrap }, ) => ( {
        increment: setWrap( 'count', ( props ) => {
          props.draft++;
        }, ),
        asyncIncrement: setWrap( 'count', ( props ) => {
          return new Promise ( resolve => {
            setTimeout( () => {
              props.draft++;
              resolve();
            }, 100 );
          });
        }, ),
        incrementBy: setWrap( 'count', ( props, amount: number, ) => {
          props.draft += amount;
        }, ),
    } ),
  }
);

// In component
function Counter() {
    const { count, } = useSelector( props => props.state );
    const {
     increment,
      asyncIncrement,
      incBy5
    } = useSelector( ( {
        acts
    }) => ( {
        increment: acts.increment,
        asyncIncrement: acts.asyncIncrement,
        incBy5(){ acts.incrementBy(5,) }
    } )
  );

  return <div>
    <h2>Count: {count}</h2>
    <button onClick={increment}>Increment</button>
    <button onClick={asyncIncrement}>Async Increment</button>
    <button onClick={incBy5}>
      Add 5
    </button>
  </div>;
}
```

Key advantages:
- **Global state** accessible across components
- **Pre-bound actions** with type-safe parameters
- **Async action support** with automatic state updates
- **Optimized subscriptions** through selector-based consumption

## Local State

```tsx
const [ state, controls ] = useCon( initialState, );
```

You get the advantages of `createConStore` but with local state.

## Custom Selectors

Optimize renders by selecting only needed state:

```tsx
function UserPreferences() {
    const preferences = useCon( initialState, {
      selector: props => ( {
        theme: props.state.user.preferences.theme,
        updateTheme( event: ChangeEvent<HTMLSelectElement> ) {
          props.set(event.target.name as Parameter<typeof props.set>[0], event.target.value, )
        },
      } ),
    } );
    return <select
      value={preferences.theme}
      name="user.preferences.theme"
      onChange={preferences.updateTheme}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>;
}
```

Selector is a function that returns the state you need. Only re-renders on non-function changes.

## Actions

Define reusable actions for complex state updates:

```tsx
function PostList() {
  const [ state, { acts, } ] = useCon(
    { posts: [ { id: 1, text: 'post', } ] },
    {
      acts: ( { currySet, wrapSet, } ) => {
        // currySet is a function that
        // returns a function that can be called with the posts array
        const setPost = currySet('posts');

        return {
          addPost( post: Post, ) {
            setPost( ( { draft } ) => {
              draft.push( post );
            });
          },
          updatePost: wrapSet(
            'posts',
            ( { draft }, id: number, updates: Partial<Post>, ) => {
              const post = draft.find( p => p.id === id );
              if (post) Object.assign( post, updates );
            }
          ),
          async fetchPosts() {
            const posts = await api.getPosts();
            setPost( posts );
          },
        },
      },
    }
  );

  return <div>
    {state.posts.map( post => (
      <PostItem
        key={post.id}
        post={post}
        onUpdate={updates => acts.updatePost(post.id, updates)}
      />
    ) )}
    <button onClick={acts.fetchPosts}>
        Refresh Posts
    </button>
  </div>;
}
```

## State History

Track and access previous state values:

```tsx
function StateHistory() {
  const [ state, { get, reset, }, ] = useCon( initialState, );

  const history = get(); // Get full state history
  const prev = history.prev;

  return <div>
    <pre>{JSON.stringify(prev, null, 2)}</pre>
    <button onClick={reset}>Reset State</button>
  </div>;
}
```

## createConStore and useCon Parameters Overview

`createConStore` and `useCon` take the same parameters.

### 1. `initial`

```ts
// works with createConStore
useCon( {} );
useCon( () => ({}) );
useCon( [] );
useCon( () => ([]) );
```

Used to initialize the [`state`](#state) value. non-null `Object` with data, `Array`,
or a function that returns an `Object` or `Array`

### 2. `options`

Configuration options for `createConStore` and `useCon`.

```ts
useCon( initial, options );
```

#### 2.1. `options.acts`

Callback `function` for creating a Record of action handlers. The action handlers have access to a subset of the controls object.

```ts
useCon(
  initial,
  {
    acts: ( {
      set,
      currySet,
      setWrap,
      get,
      reset,
      getDraft,
      setHistory,
      currySetHistory,
      setHistoryWrap,
    }: ActControls ) => ( {
      // your actions with async support
      yourAction( props, ) {
        // your code
      }
    } ),
  }
);
```

#### 2.2. `options.afterChange`

Async callback after state changes.

```ts
useCon(
  initial,
  {
    afterChange(
      { state, initial, prev, prevInitial, changes, }: History
    ) {
      // your code with async support
    }
  }
);
```

#### 2.3. `options.transform`

Callback `function` to transform the `state` and/or `initial` properties before it is set/reset. Receives a draft and current history

```ts
useCon(
  initial,
  {
    transform: (
      { state, initial, }: HistoryDraft,
      { state, initial, prev, prevInitial, changes, }: History,
      type: 'set' | 'reset',
    ) => {
      // your code
    }
  }
);
```

#### 2.4. `options.mutOptions`

Configuration for [`mutative` options](https://mutative.js.org/docs/api-reference/create#createstate-fn-options---options). `{enablePatches: true}` not supported.

### 3. `selector`

Custom `selector` callback that lets you shape what is returned from `useCon` and `createConStore`.

`useCon` Example:

```ts
useCon(
  initialState,
  options,
  ( {
    state,
    acts,
    set,
    currySet,
    setWrap,
    get,
    reset,
    getDraft,
    setHistory,
    currySetHistory,
    setHistoryWrap,
    useSelector, // only available in `useCon`
    subscribe,
  }: UseConControls, ) => unknown // unknown represents the return type of your choice
);

// Example without options
useCon( initialState, selector, );
```

```ts
createConStore(
  initialState,
  options,
  ( {
    state,
    acts,
    set,
    currySet,
    setWrap,
    get,
    reset,
    getDraft,
    setHistory,
    currySetHistory,
    setHistoryWrap,
    subscribe,
  }: CreateConStoreControls, ) => unknown // unknown represents the return type of your choice
);

// Example without options
createConStore( initialState, selector, );
```

**Note for all selectors**: Under the hood, any return value from `selector` will be evaluated by a custom [strictDeepEqual](https://github.com/planttheidea/fast-equals?tab=readme-ov-file#strictdeepequal) `function` that ignores checking `function`s for equality. 
This prevents infinite re-renders while allowing for deep comparison of objects, arrays, and primitives.

Example:

```ts
const useConSelector = createConStore(
  initialState,
  ( { set, }, ) => set,
);

// this will never trigger re-renders because the selector returned a function.
const set = useConSelector();

// this will re-render when `state` changes.
const [
  set,
  state,
] = useConSelector( ( { set, state, }, ) => [ set, state, ] as const );
```

## `useCon`

Local state manager for a React Component

```ts
const [ state, controls, ] = useCon( initialState, options, selector, );
```

### `useSelector`
`useCon` has access to additional control property from `selector` named `useSelector`. A `function` that works like what `createConStore` returns.
- By default, returns `[state, controls]` when no selector is provided. If a `selector` is provided, it returns the result of the `selector`.
- This allows you to use local state as a local store that can be passed down to other components, where each component can provide a custom `selector`.

```ts
const useSelector = useCon( initialState, controls => controls.useSelector );
const state = useSelector(controls => controls.state);
const set = useSelector(controls => controls.set);
```

## `createConStore`

Global store state manager.

```ts
const useConSelector = createConStore( initialState, options, selector, );
```

### `useConSelector`
Called `useConSelector` for reference. You have a choice in naming.

By default, returns `[ state, controls, ]` when no `selector` is provided.

```ts
const [ state, controls, ] = useConSelector();
```

`useConSelector` has static props

```ts
// static props
const {
  acts,
  set,
  currySet,
  setWrap,
  get,
  reset,
  setHistory,
  currySetHistory,
  setHistoryWrap,
  subscribe,
}: UseConSelectorControls = useConSelector
```

If a `selector` is provided from `createConStore` or `useConSelector`, it returns the result of the `selector`.

```ts
const yourSelection = useConSelector(
  ( {
    state,
    acts,
    set,
    currySet,
    setWrap,
    get,
    reset,
    setHistory,
    currySetHistory,
    setHistoryWrap,
    subscribe,
  }, ) => unknown
);
```

## Shared Controls

The following `function`s
- [options.acts](#21-optionsacts)
- [selector](#3-selector)
- [useSelector](#useselector)
- [useConSelector](#useconselector)

have access to the following controls:

### `get`

Gives you immutable access to [History](#history-object).

```ts
const [
  state,
  { get, }
] = useCon( { count: 0, }, );

const {
  get,
} = useConSelector( ( { get, } ) => ( { get, } ), ) ;

const history = get();
history.state;
history.initial;
history.changes;
history.prev;
history.prevInitial;
```

You can also use dot-notation to access properties.

```ts
const changesToSomeValue = get('changes.to.some.value');
```

#### `History` Object
- **state**: Current immutable state object.
- **prev**: The previous `state` immutable object before `state` was updated.
- **initial**: Immutable initial state it started as. It can be updated through `historyDraft` for resync purposes like merging with server data while `state` keeps client side data.
- **prevInitial**: The previous `initial` immutable object before `initial` was updated.
- **changes**: Immutable object that keeps track of top level properties (shallow) difference between the `state` and `initial` object.

### `state`

The current `state` value. Initialized from [options.initialState](#1-initial).

Same value as `get( 'state' )`. Provided for convenience and to trigger re-render on default selector update.

```ts
const [
  state,
] = useCon( { count: 0, }, );

const {
  state,
} = useConSelector(( { state, } ) => ( { state, }, ));
```

### `set`

Updates state with either a new state object or mutation callback.

```ts
const [
  state,
  { set, }
] = useCon( { count: 0, }, );

const {
  set,
} = useConSelector( ( { set, } ) => ( { set, }, ));
```

All `set` calls returns a new [History](#history-object) object that contains the following properties:

### `set( state )`

Updates state with a new state object.

```ts
set( { my: 'whole', data: ['items'], }, );
```

### `set( callback )`

Updates state with a mutation callback.
Callback expects `void` return type.

```ts
set( ( {
  draft,
  historyDraft,
  state,
  prev,
  initial,
  prevInitial,
  changes,
}, ) => {
  draft.value = 5;
  historyDraft.initial.value = 9
}, );
```

#### `set` callback parameters

Contains [`History`](#history-object) properties plus:
- **draft**: The mutable part of the `state` object that can be modified in the callback.
- **historyDraft**: Mutable `state` and `initial` object that can be modified in the callback.

### `set( 'dot.notation.0.path.to\\.value', value )`

Specialized overload for updating state at a specified dot-notated string path with a direct value.

```ts
set( 'my.data', [ 'new', 'value', ], );
```

Array index number as string, example `paths.0.name` = `paths[0].name`.

Paths with `.` (dot) in their name must be escaped, example

```ts
const initial = {
  path: {
    'user.name': 'Name',
  },
}; // 'path.user\\.name'
```

### `set( ['string', 'path', 0, 'to.value'], value )`

Specialized overload for updating state at a specified array of strings or numbers (for arrays) path with a direct value.

Array path to the state property to update, can have dot notation, e.g. `['items', 0]` or `['users', 2, 'address.name']`

Callback works the same as [set( 'path.to.value', callback )](#set-pathtovalue--path-to-value-callback-)

```ts
set( ['string', 'path', 0, 'to.value'], [ 'new', 'value' ] );
```

### `set( 'path.to.value' | ['path', 'to', 'value'], callback )`

Specialized overload for updating state at a specified
array of strings or numbers (for arrays) or dot-notated string
path with a callback function.

```ts
set( 'my.data', ( {
  // same as set( callback )
  draft, historyDraft, state, prev, initial, prevInitial, changes,
  stateProp,
  prevProp,
  initialProp,
  prevInitialProp,
  changesProp,
}, ) => {
  draft.value = 5;
  historyDraft.initial.value = 9
}, );
```

#### `set` with path callback parameters

Shares the same parameters as [set( callback )](#set-callback-parameters), in addition to:

- **draft**: The mutable part of the `state` value relative to path.
  - **ALERT**: When path leads to a primitive value, you must use mutate `draft` via non-destructuring.
    - i.e. `set( 'path.to.primitive', (props) => props.draft = 5 )`
- **stateProp**: The current immutable `state` value relative to path.
- **initialProp**: The `initial` immutable value relative to path.
- **prevProp**: The previous immutable `state` value relative to path. Can be `undefined`.
- **prevInitialProp**: The previous immutable `initial` value relative to path. Can be `undefined`.
- **changesProp**: Immutable changed value made to the `state` value relative to path. Can be `undefined`.

### `acts`

The `acts` object contains all the available actions created from [options.acts](#21-optionsacts).

```ts
const [
  state,
  { acts, }
] = useCon( { count: 0 } );

const {
  acts,
} = useConSelector( ( { acts, } ) => ( { acts, } ), );
```

### `setWrap`

A convenient `function` that lets you wrap `set` around another `function` that accepts any number of arguments
and can return any value from it.

```tsx
const [
  state,
  { setWrap, }
] = useCon( { count: 0, }, );

const {
  setWrap,
} = useConSelector( ( { setWrap, } ) => ( { setWrap, } ), );

// Example usage
const inc = setWrap( ( { draft, }, incBy: number, ) => draft.count += incBy );

const newInc = inc( 5, ); // returns 5

// Example usage
const incCount = setWrap( 'count', ( props, incBy: number, ) => props.draft += incBy );

const newCount = inc( 5, ); // returns 5
```

The first parameter can be
- a callback
- dot-notated string, or array of string or numbers for state prop path, followed by a callback.

### `currySet`

Creates a pre-bound `set` function for a specific dot-notation string path.
Enables partial application of path for reusable state updaters

```ts
const [
  state,
  { currySet, },
] = useCon( { count: 0, }, );

const {
  currySet,
} = useConSelector( ( { currySet, } ) => ( { currySet, } ), );

const setCount = currySet( 'count', );
setCount( 5, );
setCount( ( props, ) => props.draft += 1 );
```

### `setHistory`

Works like [set](#set), but can be used to update both `state` and `initial`.

### `setHistoryWrap`

Works like [setWrap](#setwrap), but can be used to update both `state` and `initial`.

### `currySetHistory`

Works like [currySet](#curryset), but can be used to update both `state` and `initial`.

### `reset`

Resets `state` to `initial`.
Returns [History](#history-object) with `initial` set to `state` values.

```ts
const [
  state,
  { reset, },
] = useCon( { count: 0, }, );

const {
  reset,
} = useConSelector( ( { reset, } ) => ( { reset, } ), );

reset();
```

### `subscribe`

Subscribes to state changes outside [useSelector](#useselector) or [useConSelector](#useconselector) via [selector](#selector).
Returns `function` to unsubscribe the listener.

**ALERT**:When using subscribe, you have to manage when to unsubscribe the listener.

```ts
const [
  state,
  { subscribe, },
] = useCon( { count: 0 }, );

const {
  subscribe,
} = useConSelector( ( { subscribe, } ) => ( { subscribe, } ), );

// Subscribe to state changes
const unsubscribe = subscribe( ( { state, }, ) => {
  if (state.count > 100) {
    console.log( 'Why is the count so high?' );
    notifyCountReached( state.count );
  }
}, );

// Later, when you want to stop listening
unsubscribe();
```

## Credits to

- [Mutative](https://mutative.js.org/) for efficient immutable updates
- [Immer](https://immerjs.github.io/immer/) for inspiring Mutative
- [Zustand](https://github.com/pmndrs/zustand) for the inspiration
- Øivind Loe for reminding me why I wanted to create a state management library.
