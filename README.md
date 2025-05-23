<section>

# con-estado

[![NPM License](https://img.shields.io/npm/l/con-estado)](https://github.com/rafde/con-estado/blob/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/con-estado)](https://www.npmjs.com/package/con-estado)
[![JSR Version](https://img.shields.io/jsr/v/%40rafde/con-estado)](https://jsr.io/@rafde/con-estado)
![Test](https://github.com/rafde/con-estado/actions/workflows/test.yml/badge.svg)
[![Bundlephobia minzipped size](https://badgen.net/bundlephobia/minzip/con-estado)](https://bundlephobia.com/package/con-estado)
[![Bundlephobia min size](https://badgen.net/bundlephobia/min/con-estado)](https://bundlephobia.com/package/con-estado)
[![Bundlephobia tree-shaking](https://badgen.net/bundlephobia/tree-shaking/con-estado)](https://bundlephobia.com/package/con-estado)
[![Bundlephobia dependency count](https://badgen.net/bundlephobia/dependency-count/con-estado)](https://bundlephobia.com/package/con-estado)

</section>
<section>

## Why `con-estado`?

Managing deeply nested state in React often becomes cumbersome with traditional state management solutions. `con-estado` provides:

- **Type-safe**: Full TypeScript support to provides full type inference for:
  - State structure
  - Selector return types
  - Action parameters
  - Path-based updates
  - State history
- **Immutable Updates**: Simple mutable-style syntax with immutable results
- **Direct path updates**: Modify nested properties using dot-bracket notation or `Array<string | number>` instead of spreading multiple levels
- **Referential stability**: Only modified portions of state create new references, preventing unnecessary re-renders
- **Flexible API**: Support for both local or global state
- **Custom selectors**: Prevent component re-renders by selecting only relevant state fragments
- **High Performance**: Built on [Mutative](https://mutative.js.org/)'s efficient immutable updates, `con-estado` is particularly useful for applications with:
  - Complex nested state structures
  - Performance-sensitive state operations
  - Frequent partial state updates
  - Teams wanting to reduce state management boilerplate

For documentation with working examples, see [con-estado docs](https://rafde.github.io/con-estado).

</section>
<section>

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

</section>
<section>

## Global Store

For applications needing global state management, `createConStore` provides a solution for creating actions and optimized updates:

[Global Store Basic Usage](https://stackblitz.com/edit/con-estado-global-state-basic-usage-suqy7jc6-gyigr8x4?ctl=1&embed=1&file=src%2FApp.tsx&theme=dark)

```tsx
// Demo
import { ChangeEvent } from 'react';
import { createConStore, ConHistoryStateKeys, } from 'con-estado';

// Define your initial state
const initialState = {
  user: {
    name: 'John',
    preferences: {
      theme: 'light' as 'light' | 'dark',
      notifications: {
        email: true,
      },
    },
  },
};

const useConSelector = createConStore( initialState, {
  acts: ({ set }) => ({
    onChangeInput: (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const name = event.target.name as ConHistoryStateKeys<
        typeof initialState
      >;
      const value = event.target.value;
      console.log( 'onChangeInput', name, value );
      set(
        name,
        value,
      );
    },
  }),
});

function App() {
  const state = useConSelector( 'state' );
  // Does not recreate handler
  const onClickButton = useConSelector( ( controls ) => controls.wrap( 
    'user.preferences.notifications.email', 
    ( props ) => {
      console.log( 'toggle email was ', props.stateProp);
      props.stateProp = !props.stateProp;
      console.log( 'toggle email is ', props.stateProp);
    } 
  ) );
  const onChangeInput = useConSelector.acts.onChangeInput;

  return (
    <div>
      <h1>Welcome {state.user.name}</h1>
      <input
        type="text"
        name="state.user.name"
        value={state.user.name}
        onChange={onChangeInput}
      />
      <button
        onClick={onClickButton}
      >
        Toggle Email Notifications:{' '}
        {state.user.preferences.notifications.email ? 'OFF' : 'ON'}
      </button>
      <select
        value={state.user.preferences.theme}
        name="state.user.preferences.theme"
        onChange={onChangeInput}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
```

Key advantages:
- **Global state** accessible across components
- **Optimized subscriptions** through selector-based consumption

</section>
<section>

### Using Selectors with Global Store

When using `createConStore`, the `useConSelector` hook is provided for optimized component updates:

```tsx
const useConSelector = createConStore(initialState);

function UserProfile() {
  // Only re-renders when selected data changes
  const userData = useConSelector( ( { state } ) => ({
    name: state.user.name,
    avatar: state.user.avatar
  }));

  return <div>
    <img src={userData.avatar} alt={userData.name} />
    <h2>{userData.name}</h2>
  </div>;
}
```

</section>
<section>

#### Selector Best Practices

1. Select minimal required data
2. Memoize complex computations
3. Return stable references
4. Use TypeScript for type safety

</section>
<section>

## Local State

When you need to manage state within a component with the power of `createConStore`, `useCon` has you covered:

[Local State Basic Usage](https://stackblitz.com/edit/con-estado-basic-usage-suqy7jc6?ctl=1&embed=1&file=src%2FApp.tsx&theme=dark)

```tsx
// Demo
import { ChangeEvent } from 'react';
import { useCon, ConHistoryStateKeys, } from 'con-estado';
// Define your initial state
const initialState = {
  user: {
    name: 'John',
    preferences: {
      theme: 'light' as 'light' | 'dark',
      notifications: {
        email: true,
      },
    },
  },
};

function App() {
  const [ state, { useSelector, } ] = useCon( initialState, {
    acts: ( { set } ) => ({
      onChangeInput: (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
        const name = event.target.name as ConHistoryStateKeys<
          typeof initialState
        >;
        const value = event.target.value;
        console.log('onChangeInput', name, value);
        set(name, value);
      },
    }),
  });
  const onChangeInput = useSelector( 'acts.onChangeInput' );
  // Does not recreate handler
  const onClickButton = useSelector( ( controls ) =>
    controls.wrap( 'user.preferences.notifications.email', ( props ) => {
      console.log('toggle email was ', props.stateProp);
      props.stateProp = !props.stateProp;
      console.log('toggle email is ', props.stateProp);
    })
  );

  return (
    <div>
      <h1>Welcome {state.user.name}</h1>
      <input
        type="text"
        name="state.user.name"
        value={state.user.name}
        onChange={onChangeInput}
      />
      <button
        onClick={onClickButton}
      >
        Toggle Email Notifications:{' '}
        {state.user.preferences.notifications.email ? 'OFF' : 'ON'}
      </button>
      <select
        value={state.user.preferences.theme}
        name="state.user.preferences.theme"
        onChange={onChangeInput}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
```

</section>
<section>

## Path-based Operations

`con-estado` supports flexible path notation for state updates:

```tsx
// from useCon
const theme = useSelector( 'state.user.preferences.theme' );
// from createConStore
const globalTheme = useConSelector( 'state.user.preferences.theme' );

const set = useSelector( 'set' );
// Dot-bracket notation
set( 'state.user.preferences.theme', 'dark' );

// Array notation
set( [ 'state', 'user', 'preferences', 'theme' ], 'dark');

// Array indices
set( 'state.todos[0].done', true );
set( 'state.todos[-1].text', 'Last item' ); // Negative indices supported

const merge = useConSelector( 'merge' );
// Array operations
merge( 'state.todos', [ { done: true, } ] ) ; // Merge first element in array
set( 'state.todos', [] );            // Clear array
```

</section>
<section>

### Path Update Methods

- [set](#set): Replace value at path.
- [merge](#merge): Merge into both `state` and/or `initial`.
- [commit](#commit): Modify value using a callback and/or path.
- [wrap](#wrap): Modify value using a callback that can return a value.

</section>
<section>

## Custom Selectors

Custom Selector is a `function` that optimize renders by selecting only needed state:

```tsx
function UserPreferences() {
  const preferences = useCon( initialState, props => ( {
    theme: props.state.user.preferences.theme,
    updateTheme( event: ChangeEvent<HTMLSelectElement> ) {
      props.set(
        event.target.name as ConHistoryStateKeys<typeof initialState>,
        event.target.value,
      );
    },
  } ), );
  
  return <select
    value={preferences.theme}
    name="state.user.preferences.theme"
    onChange={preferences.updateTheme}
  >
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>;
}
```

</section>
<section>

## Actions

Define reusable actions for complex state updates:

```tsx
function PostList() {
  const [ state, { acts, } ] = useCon(
    { posts: [ { id: 1, text: 'post', } ] },
    {
      acts: ( { wrap, commit, set, } ) => ({
        addPost( post: Post, ) {
          commit( 'posts', props => {
            props.stateProp.push( post );
          });
        },
        updatePost: wrap(
          'posts',
          ( { stateProp }, id: number, updates: Partial<Post>, ) => {
            const post = stateProp.find( p => p.id === id );
            if (post) Object.assign( post, updates );
          }
        ),
        async fetchPosts() {
          const posts = await api.getPosts();
          set( 'state.posts', posts );
        },
      },
    })
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

</section>
<section>

## State History

Track and access previous state values:

- **state**: Current immutable state object.
- **prev**: The previous immutable `state` object before `state` was updated.
- **initial**: Immutable initial state it started as. It can be updated through `historyDraft` for re-sync purposes,
such as merging server data into `initial` while `state` keeps latest client side data.
- **prevInitial**: The previous immutable `initial` object before `initial` was updated.
- **changes**: Immutable object that keeps track of deeply nested difference between the `state` and `initial` object.

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

</section>
<section>

## Batch Updates

In cases where you need to consecutively [`set`](#set), [`merge`](#merge), or [`reset`](#reset) data,
you probably don't want to trigger consecutive re-renders. In this case, you can batch these updates by calling them in
[`commit`](#commit) or [`wrap`](#wrap)

```ts
// state.set.some.arr = [ { data: 0 }, ]
commit( () => {
  // state.set.some.arr = [ { data: 0 }, { data: 1 }, ]
  merge( 'state.set.some.arr', [ , { data: 1 }, ] );
  
  // state.set.some.arr = []
  set( 'state.set.some.arr', [] );
  
  // state.set.some.arr = [ { data: 0 }, ]
  reset();
});
```

This provides the convenience of using `merge`, `set`, or `reset` without having to worry about multiple re-renders.

</section>
<section>

## Example: To Do App

An complex to-do app example of how `con-estado` can be used.

[To Do Example](https://stackblitz.com/edit/con-estado-todont-app-fikb7k8w?ctl=1&embed=1&file=src%2Fstore%2Findex.ts)

</section>
<section>

## Parameters API

`createConStore` and `useCon` take the same parameters.

</section>
<section>

### 1. `initial`

```ts
// works with createConStore
useCon( {} );
useCon( () => ({}) );
useCon( [] );
useCon( () => ([]) );
```

Used to initialize the [`state`](#state) value. non-`null` `Object`, `Array`,
or a `function` that returns a non-`null` `Object` or `Array`

</section>
<section>

### 2. `options`

Configuration options for `createConStore` and `useCon`.

```ts
useCon( initial, options );

createConStore( initialState, options );
```

</section>
<section>

#### 2.1. `options.acts`

Optional factory function for creating a Record of action handlers and state transformations.
The action handlers have access to a subset of the controls object.

**Return type**: `Record<string | number, (...args: unknown[]) => unknown>`

```ts
useCon(
  initial,
  {
    acts: ( {
      commit,
      get,
      merge,
      reset,
      set,
      wrap,
    } ) => ( {
      // your actions with async support
      yourAction( props, ) {
        // your code
      }
    } ),
  }
);
```

</section>
<section>

#### 2.2. `options.beforeChange`

Function to modify state before it's committed to history.
Enables validation, normalization, or transformation of state updates.

- **historyDraft**: A Mutative draft of `state` and `initial` that can be modified for additional changes.
- **history**: Immutable [State History](#state-history). Does not have latest changes.
- **type**: The operation type (`'set' | 'reset' | 'merge' | 'commit' | 'wrap'`) that triggered changes.
- **patches**: A partial state object that contains the latest deeply nested changes made to `state` and/or `initial`.
  Useful for when you want to include additional changes based on what `patches` contains.

**Return type**: `void`

```tsx
useCon( initialState, {
  beforeChange: ({
    historyDraft, // Mutable draft of `state` and `initial`
    history,      // Current immutable history
    type,         // Operation type: 'set' | 'reset' | 'merge' | 'commit' | 'wrap'
    patches,      // Latest changes made to `state` or `initial`
  }) => {
    // Validate changes
    if (historyDraft.state.count < 0) {
      historyDraft.state.count = 0;
    }

    // Add additional changes
    if (patches.user?.name) {
      historyDraft.state.lastUpdated = Date.now();
    }
  }
});
```
</section>

<section>

#### 2.3. `options.afterChange`

Post-change `async` callback `function` executed after state changes are applied.
Provides access to the updated [State History](#state-history) and the patches that were made.

**Return type**: `void`

```ts
useCon(
  initial,
  {
    afterChange(
      { state, initial, prev, prevInitial, changes, },
      { state, initial } // patches: what deeply nested specific changes where made
    ) {
      // your code with async support
    }
  }
);
```
</section>

<section>

#### 2.4. `options.mutOptions`

Configuration for [`mutative` options](https://mutative.js.org/docs/api-reference/create#createstate-fn-options---options).

```tsx
useCon( initialState, {
  mutOptions: {
    // Mutative options (except enablePatches)
    strict: true,
    // ... other Mutative options
  }
});
```

`{enablePatches: true}` not supported.

</section>

<section>

### 3. `selector`

Custom `selector` callback that lets you shape what is returned from `useCon` and/or `createConStore`.

`useCon` Example:

```ts
useCon(
  initialState,
  options,
  ( {
    acts,
    commit,
    get,
    merge,
    reset,
    set,
    wrap,
    state,
    subscribe,
    useSelector, // only available in `useCon`
  }, ) => unknown // `unknown` represents the return type of your choice
);

// Example without options
useCon( initialState, selector, );
```

```ts
createConStore(
  initialState,
  options,
  ( {
    acts,
    commit,
    get,
    merge,
    reset,
    set,
    wrap,
    state,
    subscribe,
  }, ) => unknown // unknown represents the return type of your choice
);

// Example without options
createConStore( initialState, selector, );
```

**TIP**: When selectors return a function or object with a function, those functions will not trigger re-render when changed.
This is a precaution to prevent unnecessary re-renders since creating functions create a new reference.

Examples:

```ts
// Won't re-render
const setCount = useCon( 
  initialState,
   controls => controls.state.count < 10
    ? controls.wrap( 'count' )
    : () => {}
);

// Won't re-render, but it will do something.
const setCount = useCon( initialState, controls => (value) => {
  controls.state.count < 10
   ? controls.set( 'state.count', value )
   : undefined
});
```

```ts
// This will re-render when `controls.state.count` has updated. 
const setCount = useCon( initialState, controls => ({
  count: controls.state.count,
  setCount: controls.state.count < 10
   ? controls.wrap( 'count' )
   : () => {}
}));
```

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

</section>
<section>

## `useCon`

Local state manager for a React Component

```ts
const [ state, controls, ] = useCon( initialState, options, selector, );
```
</section>
<section>

### `useSelector`

`useCon` has access to additional control property from `selector` named `useSelector`.
A `function` that works like what `createConStore` returns.
- By default, returns `[state, controls]` when no selector is provided. If a `selector` is provided, it returns the result of the `selector`.
- This allows you to use local state as a local store that can be passed down to other components, where each component can provide a custom `selector`.

```ts
const useSelector = useCon( initialState, controls => controls.useSelector );
const state = useSelector(controls => controls.state);
const set = useSelector(controls => controls.set);
```

**TIP**: If your `selector` return value is/has a `function`, function will not be seen as a change to 
trigger re-render. This is a precaution to prevent unnecessary re-renders since all dynamic functions create a new reference. 
If you need to conditional return a `function`, it's better if you make a `function` that can handle your condition.

example

```ts
// Won't re-render
const setCount = useCon( 
  initialState,
  controls => controls.state.count < 10
   ? controls.wrap( 'count' )
   : () => {}
);

// Won't re-render, but it will do something.
const setCount = useCon( initialState, controls => (value) => {
  controls.state.count < 10 ? controls.set( 'state.count', value ) : undefined
});
```

```ts
// This will re-render when `controls.state.count` value is updated
const setCount = useCon( initialState, controls => ({
  count: controls.state.count,
  setCount: controls.state.count < 10 ? controls.wrap( 'count' ) : () => {}
}));
```

You can also access the controls directly from `useSelector` using a `string` path.

If a `string` path starts with `state`, `initial`, `prev`, `prevInitial` or `changes`,
it returns the value of the property from the [State History](#state-history).

```ts
const name = useSelector( 'state.user.name' );
```

If a `string` path to `acts` is provided, it returns the action function.

```ts
const yourAction = useSelector( 'acts.yourAction' );
```

Other `string` paths to `get`, `commit`, `merge`, `reset`, `set`, `subscribe`, `wrap` will return corresponding `function`.

</section>
<section>

## `createConStore`

Global store state manager.

```ts
const useConSelector = createConStore( initialState, options, selector, );
```

</section>
<section>

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
  commit,
  get,
  merge,
  reset,
  set,
  subscribe,
  wrap,
} = useConSelector
```

If a `selector` is provided from `createConStore` or `useConSelector`, it returns the result of the `selector`.

```ts
const yourSelection = useConSelector(
  ( {
    acts,
    commit,
    get,
    merge,
    reset,
    set,
    state,
    subscribe,
    wrap,
  }, ) => unknown
);
```

You can also access the controls directly from `useConSelector` using a `string` path.

If a `string` path starts with `state`, `initial`, `prev`, `prevInitial` or `changes`,
it returns the value of the property from the [State History](#state-history).

```ts
const name = useConSelector( 'state.user.name' );
```

If a `string` path to `acts` is provided, it returns the action function.

```ts
const yourAction = useConSelector( 'acts.yourAction' );
```

Other `string` paths to `get`, `commit`, `merge`, `reset`, `set`, `subscribe`, `wrap` will return corresponding `function`.

</section>
<section>

## Shared Controls API

The following `function`s
- [options.acts](#21-optionsacts)
- [selector](#3-selector)
- [useSelector](#useselector)
- [useConSelector](#useconselector)

have access to the following controls:

</section>
<section>

### `get`

The `get()` function returns a complete immutable [State History](#state-history) object:

```ts
const [
  state,
  { get, }
] = useCon( { count: 0, }, );

const {
  get,
} = useConSelector( ( { get, } ) => ( { get, } ), ) ;

const history = get();
// Available properties:
history.state;        // Current state
history.prev;         // Previous state
history.initial;      // Initial state
history.prevInitial;  // Previous initial state
history.changes;      // Tracked changes between state and initial

// Access nested properties directly
const specificChange = get( 'changes.user.name' );
const specificChange = get( [ 'changes', 'user', '.name' ] );
```

</section>
<section>

### `state`

The current immutable `state` value. Initialized from [options.initialState](#1-initial).

Same value as `get( 'state' )`. Provided for convenience and to trigger re-render on default selector update.

```ts
const [
  state,
] = useCon( { count: 0, }, );

const {
  state,
} = useConSelector( ( { state, } ) => ( { state, }, ) );
```

</section>
<section>

### `set`

`set` provides ways to replace `state` and/or `initial` values simultaneously.

```tsx
// state = { count: 1, items: ['old'] }
// initial = { count: 0, items: [] }

set( {
  state: { count: 5, items: ['new'] },
  initial: { count: 5, items: ['new'] }
} );
// state = { count: 5, items: ['new'] }
// initial = { count: 5, items: ['new'] }

set( {
  state: { count: 10, items: ['new new'] },
} );
// state = { count: 10, items: ['new new'] }
// initial = { count: 5, items: ['new'] }

set( {
  initial: { count: 20, items: ['new new new'] },
} );
// state = { count: 10, items: ['new new'] }
// initial = { count: 20, items: ['new new new'] }
```

Can be called within [commit](#commit) or [wrap](#wrap) callbacks.

</section>
<section>

#### Path-based `set`

Replace specific values at specific paths in `state` or `initial`:

```tsx
// state = { user: { name: 'John', age: 25 }, items: [ 'one', 'two' ] }
// initial = { user: { name: 'John', age: 20 } }

// String path
set( 'state.user.age', 30 );
// state.user.age === 30
// initial unchanged

set( 'initial.user.age', 21 );
// initial.user.age === 21
// state unchanged

// Set array
set( 'state.items', [ 'three', 'four' ] );
// state.items === [ 'three', 'four' ]

// Set specific index
set( 'state.items[0]', 'updated' );
// state.items === [ 'updated', 'four' ]

// Array path
set( [ 'state', 'user', 'name' ], 'Jane' );
// state.user.name === 'Jane'
```

Negative indices are allowed, but they can't be out of bounds. E.g., `[ 'initial', 'posts', -1 ]` or `initial.posts[-1]`
is valid if 'posts' has at least one element.

```ts
// initial = { posts: [ 
//  undefined, 
//  { title: 'Second post', content: 'Second post content', }, 
// ], }

set( 'initial.posts[-1]', { title: 'Updated Second Title', } );
// initial = { posts: [ 
//  undefined, 
//  { title: 'Updated Second Title', }, 
// ], }; 

set( [ 'initial', 'posts', -2 ], { title: 'Updated First Content' }, );
// initial = { posts: [
//  { title: 'Updated First Content', },
//  { title: 'Updated Second Title', },
// ], }; 

set( 'initial.posts[-3]', { title: 'Third Title', }, ); // throws error
```

**Error Cases**

Throws errors in these situations:
- Trying to access non-object/array properties with dot-bracket notation
- Out of bounds negative indices

```ts
// initial = {
//   count: 1,
//   posts: ['post1', 'post2']
// };

// Invalid paths
set( 'initial.count.path.invalid', 42 ); // Error: `count` is not an object.

// Out of bounds
set( 'initial.posts[-999]', 'value' ); // Error: Index out of bounds. Array size is 2.
```

</section>
<section>

##### `set` Paths with Special Characters

Keys containing dots `.`, or opening bracket `[` must be escaped with backslashes.

Does not apply to array path keys.

```ts
// initial = {
//   path: {
//     'user.name[s]': 'Name',
//   },
// };

set( 'initial.path.user\\.name\\[s]', 'New Name', );
// set( [ 'initial', 'path', 'user.name[s]' ], 'New Name', );
```

</section>
<section>

##### `set` Non-existing Path

Automatically creates intermediate `object`s/`array`s:

```tsx
// state = {}
// initial = {}

set( 'state.deeply.nested.value', 42 );
// state = {
//   deeply: {
//     nested: {
//       value: 42
//     }
//   }
// }

// Arrays are created for numeric paths
set( 'initial.items[0].name', 'First', );
// initial = {
//   items: [ { name: 'First' } ]
// }
```

**Error Cases**

Throws errors in these situations:
- Trying to access non-object/array properties with dot-bracket notation
- Out of bounds negative indices

```ts
// initial = {
//   count: 1,
//   posts: ['post1', 'post2']
// };

// Invalid paths
set( 'initial.count.path.invalid', 42, ); // Error: `count` is not an object.

// Out of bounds
set( 'initial.posts[-999]', 'value', ); // Error: Index out of bounds. Array size is 2.
```

</section>
<section>

### `commit`

The `commit` method provides atomic updates to both `state` and `initial` values.
It supports the following usage patterns:

</section>
<section>

#### `commit` Callback

Update multiple values at the root level:

```ts
commit( ( { state, initial } ) => {
  state.count = 5;
  state.user.name = 'John';
  initial.count = 0;
});
```

Can be called within [commit](#commit) or [wrap](#wrap) callbacks.

</section>
<section>

##### `commit` Callback Parameters

Contains the following parameters:
1. **props**: [State History](#state-history) properties.
	- **state**: Mutable `state` object that can be modified in the callback.
	- **initial**: Mutable `initial` object that can be modified in the callback.
	- **prev**: Immutable previous `state` object (`undefined` on first update).
	- **prevInitial**: Immutable previous `initial` object (`undefined` on first update).
	- **changes**: Immutable changes made to state (`undefined` on first update).

```ts
commit( ( {
  state,      // Mutable current state
  initial,    // Mutable initial state
  prev,       // Immutable previous state
  prevInitial,// Immutable previous initial state
  changes,    // Immutable changes made to state
} ) => {
  // Your update logic
});
```

</section>
<section>

#### Path-based `commit` Callback

Update `state` and/or `initial` at a specific path using dot-bracket notation:

```tsx
// {
//   state: {
//     user: {
//       profile: { name: 'John' },
//       settings: { theme: 'light' }
//     },
//     posts: ['post1', 'post2']
//   },
//   initial: {
//     user: {
//       profile: { name: '' },
//       settings: { theme: 'light' }
//     },
//     posts: ['post1', ]
//   }
// };

// String path
commit( 'user.profile.name', (props) => {
  props.stateProp = 'Jane';
});
// state.user.profile.name === 'Jane'

// Array path
commit( [ 'user', 'settings', 'theme' ], ( props ) => {
  props.initialProp = 'light';
});

// Array indices
commit( 'posts[0]', ( props ) => {
  props.stateProp = 'updated post';
});
// commit( [ 'posts', 0 ], ( props ) => { props.stateProp = 'updated post'; });

// Clear array
commit( 'posts', ( props ) => {
  props.stateProp = [];
});
commit( [ 'posts' ], ( props ) => { props.stateProp = []; });
// state.posts = []
```

Negative indices are allowed, but they can't be out of bounds. E.g., `['posts', -1]` or `posts[-1]`
is valid if 'posts' has at least one element.

```ts
// state = { posts: [ 
//  undefined, 
//  { title: 'Second post', content: 'Second post content', }, 
// ], }

commit( 'posts[-1]', ( props ) => {
  props.stateProp = 'Updated Second Title';
});

// state = { posts: [ 
//  undefined, 
//  { title: 'Updated Second Title', content: 'Second post content', }, 
// ], }; 

commit( [ 'posts', -2, 'title' ], ( props ) => {
  props.stateProp = 'Updated First Content';
} );

// state = { posts: [
//  { title: 'Updated First Content', },
//  { title: 'Updated Second Title', content: 'Second post content', },
// ], }; 

commit( 'posts[-3]', ( props ) => {
  props.stateProp = 'Third Title'; // throws error
}, );
```

**Error Cases**

Throws errors in these situations:
- Trying to access non-object/array properties with dot-bracket notation
- Out of bounds negative indices

```ts
// state = {
//   count: 1,
//   posts: ['post1', 'post2']
// };

// Invalid paths
commit( 'count.path.invalid', ( props ) => {
  props.stateProp = 42;  // Error: `count` is not an object.
}); 

// Out of bounds
commit( 'posts[-999]', ( props ) => {
  props.stateProp = 'value'; // Error: Index out of bounds. Array size is 2.
});
```

</section>
<section>

##### `commit` Special Character Paths

Keys containing dots `.`, or opening bracket `[` must be escaped with backslashes.

Does not apply to array path keys.

```ts
// state = {
//   path: {
//     'user.name[s]': 'Name',
//   },
// };

commit( 'path.user\\.name\\[s]', ( props ) => {
  props.stateProp = 'New Name';
}, );
// commit( [ 'path', 'user.name[s]' ], ( props ) => {
//  props.stateProp = 'New Name';
//}, ); );
// state.path.user.name[s] === 'New Name'
```

</section>
<section>

##### `commit` Non-existing Paths

When setting a value at a non-existing path, intermediate `object`s or `array`s are created automatically:

```tsx
commit( 'deeply.nested.value', ( props ) => {
  props.stateProp = 42;
});
// state = {
//   deeply: {
//     nested: {
//       value: 42
//     }
//   }
// };

// Arrays are created when using numeric paths
commit( 'items[0].name', ( props ) => {
  props.stateProp = 'First';
});
// state = {
//   deeply: {
//     nested: {
//       value: 42
//     }
//   },
//   items: [ { name: 'First' } ]
// };
```

**Error Cases**

Throws errors in these situations:
- Trying to access non-object/array properties with dot-bracket notation
- Out of bounds negative indices

```ts
// state = {
//   count: 1,
//   posts: [ 'post1', 'post2' ]
// };

// Invalid paths
commit( 'count.path.invalid', ( props ) => {
  props.stateProp = 42;  // Error: `count` is not an object.
}); 

// Out of bounds
commit( 'posts[-999]', ( props ) => {
  props.stateProp = 'value'; // Error: Index out of bounds. Array size is 2.
});
```

</section>
<section>

##### Path-based `commit` Callback Parameters

Same as [commit Callback Parameters](#commit-callback-parameters) plus:
- **stateProp**: Mutable `state` value relative to path.
- **initialProp**: Mutable `initial` value relative to path.
- **prevProp**: Immutable `prev` value relative to path. Can be `undefined`.
- **prevInitialProp**: Immutable `prevInitial` value relative to path. Can be `undefined`.
- **changesProp**: Immutable `changes` value relative to path. Can be `undefined`.

```ts
commit( 
  'my.data', 
  (
    {
      // same as commit( callback )
      state, prev, initial, prevInitial, changes,
      // Path-based properties
      stateProp, // Mutable `state` value relative to path
      initialProp, // Mutable `initial` value relative to path
      prevProp, // Immutable `prev` state value relative to path, (`undefined` on first update).
      prevInitialProp, // Immutable `prevInitial` value relative to path, (`undefined` on first update).
      changesProp, // Immutable `changes` value made to state value relative to path, (`undefined` on first update).
    },
  ) => {
    // your code
}, );
```

</section>
<section>

### `merge`

Merge `object`s/`array`s at a specific path.

```ts
// initial.user = {
//   profile: { firstName: 'John', },
//   preferences: { theme: 'light', },
// };

merge( {
  initial: {
    user: {
      profile: { lastName: 'Doe', },
      preferences: { theme: 'dark', },
    },
  },
} );

// initial.user = {
//   profile: { firstName: 'John', lastName: 'Doe', },
//   preferences: { theme: 'dark', },
// };
```

Can be called within [commit](#commit) or [wrap](#wrap) callbacks.

</section>
<section>

#### Path-based `merge`

`merge` updates `state` at a specific `string` path, e.g. 'user.profile',
in the history state using a dot-bracket-notation for path or `array` of `string`s or `number`s (for `array`s).

```tsx
// initial = {
//   user: {
//     profile: { name: 'John' },
//     settings: { notifications: { email: true } }
//   }
// };

// String path
merge( 'initial.user.profile', { age: 30 } );
// initial.user.profile === { name: 'John', age: 30 }

// Array path
merge( [ 'initial', 'user', 'settings' ], { theme: 'dark' } );
// initial.user.settings === { notifications: { email: true }, theme: 'dark' }
```

Negative indices are allowed, but they can't be out of bounds. E.g., `['posts', -1]` or `posts[-1]`
is valid if 'posts' has at least one element.

```ts
// initial = { posts: [ 
//  undefined, 
//  { title: 'Second post', content: 'Second post content', }, 
// ], }

merge( 'initial.posts[-1]', { title: 'Updated Second Title', } );
// initial = { posts: [ 
//  undefined, 
//  { title: 'Updated Second Title', content: 'Second post content', }, 
// ], }; 

merge( [ 'initial', 'posts', -2 ], { title: 'Updated First Content' }, );
// initial = { posts: [
//  { title: 'Updated First Content', },
//  { title: 'Updated Second Title', content: 'Second post content', },
// ], }; 

merge( 'initial.posts[-3]', { title: 'Third Title', }, ); // throws error
```

**Error Cases**

Throws errors in these situations:
- Type mismatches
- Trying to access non-object/array properties with dot-bracket notation
- Out of bounds negative indices

```ts
// initial = {
//   count: 1,
//   posts: ['post1', 'post2']
// };

// Invalid paths
merge( 'initial.count.path.invalid', 42 ); // Error: `count` is not an object.

// Invalid paths
merge( 'initial.posts', { post: 'new post' } ); // Error: cannot merge object into array

// Out of bounds
merge( 'initial.posts[-999]', 'value' ); // Error: Index out of bounds. Array size is 2.
```

</section>
<section>

##### `merge` Special Characters in Paths

Keys containing dots `.`, or opening bracket `[` must be escaped with backslashes.

Does not apply to array path keys.

```ts
// initial = {
//   path: {
//     'user.name[s]': 'Name',
//   },
// };

merge( 'initial.path.user\\.name\\[s]', 'New Name', );
// merge( [ 'initial', 'path', 'user.name[s]' ], 'New Name', );
```

</section>
<section>

##### `merge` Non-existing Path

Automatically creates intermediate `object`s/`array`s:

```tsx
// initial = {};

merge( 'initial.nested.data', { value: 42 });
// initial = {
//   nested: {
//     data: { value: 42 }
//   }
// };

merge( 'initial.items[1]', { name: 'Second' });
// initial = {
//   items: [
//     undefined,
//     { name: 'Second' }
//   ]
// };
```

</section>
<section>

#### `merge` Special Cases

1. Non-plain Objects:

```tsx
// Non-plain objects replace instead of merge
merge( 'initial.date', new Date() );  // Replaces entire value
merge( 'initial.regex', /pattern/ );  // Replaces entire value
merge( 'initial.existing.object', {} );  // Does nothing
```

2. Array Operations:

```tsx
// initial = { items: [1, 2, 3] };

// Update specific array elements using sparse arrays
merge( 'initial.items', [
  undefined,  // Skip first element
  22 // Update second element
]);
// initial = { items: [1, 22, 3] };

// Using negative indices
merge( 'initial.items[-1]', -11 );
// Updates last element
// initial = { items: [ 1, 22, -11 ] };


// To clear an array, use set instead
merge( 'initial.items', [] ); // Does nothing
set( 'initial.items', [] );  // Correct way to clear
```

</section>
<section>

### `wrap`

`wrap` creates reusable state updater functions that can accept additional parameters.

Can be called within [commit](#commit) or [wrap](#wrap) callbacks.

It supports three different usage patterns:

</section>
<section>

#### `wrap` Callback

Create reusable state updater functions that can accept additional parameters.

```tsx
// { state: { count: 1 }, initial: { count: 0 } };

const yourFullStateUpdater = wrap( async ( { state, initial }, count: number ) => {
  state.count += count;
  initial.lastUpdated = 'yesterday';
  state.lastUpdated = 'today';
  // supports async
  return await Promise.resolve( state );
});
const state = await yourFullStateUpdater( 1 );
// { state: { count: 2, lastUpdated: 'today' }, initial: { count: 0, lastUpdated: 'yesterday' } };
```

</section>
<section>

##### `wrap` Callback Parameters

Contains the following parameters:
1. **props**: [State History](#state-history) properties.
    - **state**: Mutable `state` object that can be modified in the callback.
    - **initial**: Mutable `initial` object that can be modified in the callback.
    - **prev**: Immutable previous `state` object.
    - **prevInitial**: Immutable previous `initial` object.
    - **changes**: Immutable changes object.
2. **...args**: Optional additional arguments passed to the wrap

```ts
const yourUpdater = wrap( 
  (
    {
      state, // Mutable state
      initial, // Mutable initial state
      prev, // Immutable previous state
      prevInitial, // Immutable previous initial state
      changes, // Immutable changes
    },
    ...args
  ) => {
    // your code
  }, 
);
```

</section>
<section>

#### Path-based `wrap`

Update `state` and/or `initial` at a specific path using dot-bracket notation:

```tsx
// {
//   state: {
//     user: {
//       profile: { name: 'John' },
//       settings: { theme: 'light' }
//     },
//     posts: ['post1', 'post2']
//   },
//   initial: {
//     user: {
//       profile: { name: '' },
//       settings: { theme: 'light' }
//     },
//     posts: [ 'post1', ]
//   }
// };

// String path
const setName = wrap( 'user.profile.name', ( props, name ) => {
  props.initialProp = props.stateProp;
  props.stateProp = name;
});

setName( 'Jane' );
// initial.user.profile.name === 'John'
// state.user.profile.name === 'Jane'

// Array path
const setTheme = wrap( [ 'user', 'settings', 'theme' ], ( props, theme ) => {
  props.initialProp = props.stateProp;
  props.stateProp = theme;
});

setTheme( 'dark' );
// initial.user.settings.theme === 'light'
// state.user.settings.theme === 'dark'

// Array indices
const updatePost = wrap( 'posts[0]', ( props, post ) => {
  props.stateProp = post;
});
// wrap( [ 'posts', 0 ], ( props, post ) => { props.stateProp = post; });

updatePost( 'updated post' );
// state.posts[0] = 'updated post'

// Clear array
const clearPosts = wrap( 'posts', ( props ) => {
  props.stateProp = [];
});
// const clearPosts = wrap( [ 'posts' ], ( props ) => { props.stateProp = []; });

clearPosts();
// state.posts = []
```

Negative indices are allowed, but they can't be out of bounds. E.g., `['posts', -1]` or `posts[-1]`
is valid if 'posts' has at least one element.

```ts
// state = { posts: [ 
//  undefined, 
//  { title: 'Second post', content: 'Second post content', }, 
// ], }

const setLastPost = wrap( 'posts[-1]', (props, post) => {
  props.stateProp = post;
});

setLastPost( { title: 'Updated Second Title', });
// state = { posts: [ 
//  undefined, 
//  { title: 'Updated Second Title', content: 'Second post content', }, 
// ], }; 

const setPenultimatePost = wrap( [ 'posts', -2 ], ( props, post ) => {
  props.stateProp = post;
} );

setPenultimatePost( { title: 'Updated First Content' }, );
// state = { posts: [
//  { title: 'Updated First Content', },
//  { title: 'Updated Second Title', content: 'Second post content', },
// ], }; 

const setPenPenultimatePost = wrap( 'posts[-3]', ( props, post ) => {
  props.stateProp = post;
}, );

setPenPenultimatePost( { title: 'Third Title', }, ); // throws error
```

**Error Cases**

Throws errors in these situations:
- Trying to access non-object/array properties with dot-bracket notation
- Out of bounds negative indices

```ts
// state = {
//   count: 1,
//   posts: ['post1', 'post2']
// };

// Invalid paths
const yourUpdater = wrap( 'count.path.invalid', ( props, value ) => {
  props.stateProp = value;
}); 
yourUpdater( 42 ); // Error: `count` is not an object.

// Out of bounds
const outOfBoundsUpdater = wrap( 'posts[-999]', ( props, value ) => {
  props.stateProp = value;
});
outOfBoundsUpdater( 'value' );  // Error: Index out of bounds. Array size is 2.
```

</section>
<section>

##### `wrap` Special Character Paths

Keys containing dots `.`, or opening bracket `[` must be escaped with backslashes.

Does not apply to array path keys.

```ts
// state = {
//   path: {
//     'user.name[s]': 'Name',
//   },
// };

const yourUpdater = wrap( 'path.user\\.name\\[s]', ( props, value ) => {
  props.stateProp = value;
}, );
// wrap( [ 'path', 'user.name[s]' ], ( props, value ) => {
//  props.stateProp = value;
//}, ); );
yourUpdater( 'New Name' );
// state.path.user.name[s] === 'New Name'
```

</section>
<section>

##### `wrap` Non-existing Paths

When setting a value at a non-existing path, intermediate `object`s or `array`s are created automatically:

```tsx
// state = {
//   count: 1,
//};

const yourUpdater = wrap( 'deeply.nested.value', ( props, value ) => {
  props.stateProp = value;
});
yourUpdater( 42 );
// state = {
//   deeply: {
//     nested: {
//       value: 42
//     }
//   }
// };

// Arrays are created when using numeric paths
const yourItemUpdater = wrap( 'items[0].name', ( props, name ) => {
  props.stateProp = name;
});
yourItemUpdater( 'First' );
// state = {
//   items: [ { name: 'First' } ]
// };
```

**Error Cases**

Throws errors in these situations:
- Trying to access non-object/array properties with dot-bracket notation
- Out of bounds negative indices

```ts
// state = {
//   count: 1,
//   posts: [ 'post1', 'post2' ]
// };

// Invalid paths
const yourUpdater = wrap( 'count.path.invalid', ( props, value ) => {
  props.stateProp = value;
}); 
yourUpdater( 42 ); // Error: `count` is not an object.

// Out of bounds
const outOfBoundsUpdater = wrap( 'posts[-999]', ( props, value ) => {
  props.stateProp = value;
});
outOfBoundsUpdater( 'value' );  // Error: Index out of bounds. Array size is 2.
```

</section>
<section>

##### Path-based `wrap` Callback Parameters

Same as [wrap Callback Parameters](#wrap-callback-parameters) plus:
- **stateProp**: Mutable `state` value relative to path.
- **initialProp**: Mutable `initial` value relative to path.
- **prevProp**: Immutable `prev` value relative to path. Can be `undefined`.
- **prevInitialProp**: Immutable `prevInitial` value relative to path. Can be `undefined`.
- **changesProp**: Immutable `changes` value relative to path. Can be `undefined`.

```ts
const yourUpdater = wrap( 
  'my.data', 
  (
    {
      // same as wrap( callback )
      state, prev, initial, prevInitial, changes,
      // Path-based properties
      stateProp, // Mutable `state` value relative to path
      initialProp, // Mutable `initial` value relative to path
      prevProp, // Immutable `prev` state value relative to path
      prevInitialProp, // Immutable `prevInitial` value relative to path
      changesProp, // Immutable `changes` value made to state value relative to path
    },
    ...args
  ) => {
    // your code
}, );
```

</section>
<section>

#### `wrap` Return Values

Wrapped functions can return Promise-like or non-Promise values:

```tsx
// state = { items: [ 'a', 'b', 'c' ] }

const removeItem = wrap(
  ( { state }, index: number ) => {
    const removed = state.items[index];
    state.items.splice( index, 1 );
    return removed;
  }
);

// Usage
const removed = removeItem( 1 );  // returns 'b'
// state.items === [ 'a', 'c' ]
```

Returning Mutative draft objects will be converted to immutable objects.

</section>
<section>

### `reset`

Resets `state` to `initial`.

Can be called within [commit](#commit) or [wrap](#wrap) callbacks.

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

</section>
<section>

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

</section>
<section>

### `subscribe`

Subscribes to state changes outside [useSelector](#useselector) or [useConSelector](#useconselector) via [selector](#3-selector).
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
</section>
<section>

## TypeScript Support

`con-estado` is built with TypeScript and provides comprehensive type safety throughout your application. 
The library leverages TypeScript's type inference to provide a seamless development experience.

</section>
<section>

### Type Inference

The library automatically infers types from your initial state:

```typescript
// State type is inferred from initialState
const useStore = createConStore( {
  user: {
    name: 'John',
    age: 30,
    preferences: {
      theme: 'dark' as 'dark' | 'light',
      notifications: true
    }
  },
  todos: [
    { id: 1, text: 'Learn con-estado', completed: false }
  ]
} );

// In components:
function UserProfile() {
  // userData is typed as { name: string, age: number }
  const userData = useStore( ( { state } ) => ( {
    name: state.user.name,
    age: state.user.age
  } ) );

  // Type error if you try to access non-existent properties
  const invalid = useStore( ( { state } ) => state.user.invalid ); // Typescript error. Returns `undefined`
}
```

</section>
<section>

### Path Type Safety

When using path-based operations, TypeScript ensures you're using valid paths:

```typescript
function TodoApp() {
  const [ state, { set, commit } ] = useCon( {
    todos: [{ id: 1, text: 'Learn TypeScript', completed: false }]
  } );

  // Type-safe path operations
  set( 'state.todos[0].completed', true ); // Valid
  set( 'state.todos[0].invalid', true );   // Type error - property doesn't exist

  // Type-safe commit operations
  commit( 'todos', ( { stateProp } ) => {
    stateProp[0].completed = true; // Valid
    stateProp[0].invalid = true;   // Type error
  } );
}
```

</section>
<section>

### Custom Type Definitions

For more complex scenarios, you can explicitly define your state types:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface AppState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
}

// Explicitly typed store
const useStore = createConStore( {
  users: [],
  currentUser: null,
  isLoading: false
} as AppState );
```

</section>
<section>

### Exported Type Utilities

The library exports several utility types to help with type definitions:

```typescript
import {
  ConState,           // Immutable state type
  ConStateKeys,       // String paths for state
  ConStateKeysArray,  // Array paths for state
  ConHistory,         // History type
  ConHistoryStateKeys // String paths including history
} from 'con-estado';

// Example usage
type MyState = { count: number; user: { name: string } };
type StatePaths = ConStateKeys<MyState>; // 'count' | 'user' | 'user.name'
```

</section>
<section>

## Performance Optimization

`con-estado` uses Mutative for high performance updates, 
but there are several techniques you can use to optimize your application further:

</section>
<section>

### Use Selectors for Targeted Updates

Selectors prevent unnecessary re-renders by only updating components when selected data changes:

```typescript
// BAD: Component re-renders on any state change
function UserCount() {
  const [ state ] = useCon( { users: [], settings: {} } );
  return <div>User count: {state.users.length}</div>;
}

// GOOD: Component only re-renders when users array changes
function UserCount() {
  const [ state, { useSelector } ] = useCon( { users: [], settings: {} } );
  const userCount = useSelector( ( { state } ) => state.users.length );
  return <div>User count: {userCount}</div>;
}
```

</section>
<section>

### Memoize Complex Computations

For expensive computations, memoize the results:

```typescript
function FilteredList() {
  const  [ state, { useSelector } ] = useCon( { items: [], filter: '' }, );

  // Computation only runs when dependencies change
  const filteredItems = useSelector( ( { state } ) => {
    console.log( 'Filtering items' );
    return state.items.filter(item => 
      item.name.includes(state.filter)
    ).map(item => <div key={item.id}>{item.name}</div>);
  });

  return (
    <div>
      {filteredItems}
    </div>
  );
}
```

</section>
<section>

### Use Path-Based Updates

Update only the specific parts of state that change:

```typescript
// BAD: Creates new references for the entire state tree
set( 'state', { ...state, user: { ...state.user, name: 'New Name' } } );

// GOOD: Only updates the specific path
set( 'state.user.name', 'New Name' );
```

</section>
<section>

### Configure Mutation Options

For performance-critical applications, you can adjust mutation options:

```typescript
const useStore = createConStore(initialState, {
  mutOptions: {
    enableAutoFreeze: false, // Disable freezing for better performance
  }
});
```

</section>
<section>

## Comparison with Other Libraries

</section>
<section>

### con-estado vs Redux

| Feature        | con-estado                   | Redux                              |
|----------------|------------------------------|------------------------------------|
| Boilerplate    | Minimal                      | Requires actions, reducers, etc.   |
| Nested Updates | Direct path updates          | Requires manual spreading or immer |
| TypeScript     | Built-in inference           | Requires extra setup               |
| Middleware     | Lifecycle hooks              | Middleware system                  |
| Learning Curve | Low to moderate              | Moderate to high                   |
| Bundle Size    | Small                        | Larger with ecosystem              |
| Performance    | Optimized for nested updates | General purpose                    |

</section>
<section>

### con-estado vs Zustand

| Feature          | con-estado                   | Zustand                     |
|------------------|------------------------------|-----------------------------|
| API Style        | React-focused                | React + vanilla JS          |
| Nested Updates   | Built-in path operations     | Manual or with immer        |
| Selectors        | Built-in with type inference | Requires manual memoization |
| History Tracking | Built-in                     | Not included                |
| TypeScript       | Deep path type safety        | Basic type support          |

</section>
<section>

### con-estado vs Jotai/Recoil

| Feature        | con-estado            | Jotai/Recoil            |
|----------------|-----------------------|-------------------------|
| State Model    | Object-based          | Atom-based              |
| Use Case       | Nested state          | Fine-grained reactivity |
| Learning Curve | Moderate              | Moderate to high        |
| Debugging      | History tracking      | Dev tools               |
| Performance    | Optimized for objects | Optimized for atoms     |

</section>
<section>

## Troubleshooting

</section>
<section>

### State Updates Not Reflected in UI

**Problem**: You've updated state but don't see changes in your component.

**Solutions**:
1. Check if you're using selectors correctly
2. Verify that you're not mutating state directly
3. Ensure you're using the correct path in path-based operations

```typescript
// INCORRECT
state.user.name = 'New Name'; // Cannot direct mutate. Typescript will show error.

// CORRECT
set( 'state.user.name', 'New Name');
// OR
commit( 'user', ( { stateProp } ) => {
  stateProp.name = 'New Name';
});
// OR
commit( 'user.name', (props) => {
  props.stateProp = 'New Name';
});
```

</section>
<section>

## Debugging Tips

1. Use the history tracking to inspect state changes
2. Add logging in lifecycle hooks:

```typescript
const useStore = createConStore(initialState, {
  afterChange: ( history, patches ) => {
    console.log( 'State updated:', history.state );
    console.log( 'Changes:', patches );
  }
});
```

</section>
<section>

## Credits to

- [Mutative](https://mutative.js.org/) for efficient immutable updates
- [Immer](https://immerjs.github.io/immer/) for inspiring Mutative
- [Zustand](https://github.com/pmndrs/zustand) for the inspiration
- Øivind Loe for reminding me why I wanted to create a state management library.

</section>
