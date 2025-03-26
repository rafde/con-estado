<section className="relative space-y-2">

# con-estado

[![NPM License](https://img.shields.io/npm/l/con-estado)](https://github.com/rafde/con-estado/blob/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/con-estado)](https://www.npmjs.com/package/con-estado)
[![JSR Version](https://img.shields.io/jsr/v/%40rafde/con-estado)](https://jsr.io/@rafde/con-estado)
![Test](https://github.com/rafde/con-estado/actions/workflows/test.yml/badge.svg)

</section>
<section className="relative space-y-2">

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
<section className="relative space-y-2">

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
<section className="relative space-y-2">

## Global Store

For applications needing global state management, `createConStore` provides a solution for creating actions and optimized updates:

[Global Store Basic Usage](https://stackblitz.com/edit/con-estado-global-state-basic-usage-suqy7jc6-gyigr8x4?ctl=1&embed=1&file=src%2FApp.tsx&theme=dark)

```tsx
// Demo
import { ChangeEvent } from 'react';
import { createConStore } from 'con-estado';

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

const useGlobalSelector = createConStore( initialState, {
  acts: ({ set }) => ({
    onChangeInput: (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const name = event.target.name as unknown as Parameters<typeof set>[0];
      const value = event.target.value;
      console.log('onChangeInput', name, value);
      set(
        name,
        value,
      );
    },
  }),
});

function App() {
  const [state, { wrap, acts }] = useGlobalSelector();

  return (
    <div>
      <h1>Welcome {state.user.name}</h1>
      <input
        type="text"
        name="user.name"
        value={state.user.name}
        onChange={acts.onChangeInput}
      />
      <button
        onClick={wrap('user.preferences.notifications.email', (props) => {
          console.log('toggle email was ', props.stateProp);
          props.stateProp = !props.draft;
          console.log('toggle email is ', props.stateProp);
        })}
      >
        Toggle Email Notifications:{' '}
        {state.user.preferences.notifications.email ? 'OFF' : 'ON'}
      </button>
      <select
        value={state.user.preferences.theme}
        name="user.preferences.theme"
        onChange={acts.onChangeInput}
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
<section className="relative space-y-2">

### Using Selectors with Global Store

When using `createConStore`, the `useGlobalSelector` hook is provided for optimized component updates:

```tsx
const useGlobalSelector = createConStore(initialState);

function UserProfile() {
  // Only re-renders when selected data changes
  const userData = useGlobalSelector(state => ({
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
<section className="relative space-y-2">

#### Selector Best Practices

1. Select minimal required data
2. Memoize complex computations
3. Return stable references
4. Use TypeScript for type safety

</section>
<section className="relative space-y-2">

## Local State

When you need to manage state within a component with the power of `createConStore`, `useCon` has you covered:

[Local State Basic Usage](https://stackblitz.com/edit/con-estado-basic-usage-suqy7jc6?ctl=1&embed=1&file=src%2FApp.tsx&theme=dark)

```tsx
// Demo
import { ChangeEvent } from 'react';
import { useCon } from 'con-estado';
// Define your initial state
const initialState = {
  user: {
    name: 'John',
    preferences: {
      theme: 'light' as 'light' | 'dark'
      notifications: {
        email: true,
      },
    },
  },
};

function App() {
  const [ state, { wrap, acts } ] = useCon( initialState, {
    acts: ({ set }) => ({
      onChangeInput: (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name as unknown as Parameters<typeof set>[0];
        const value = event.target.value;
        console.log('onChangeInput', name, value);
        set( name, value );
      },
    }),
  });

  return (
    <div>
      <h1>Welcome {state.user.name}</h1>
      <input
        type="text"
        name="user.name"
        value={state.user.name}
        onChange={acts.onChangeInput}
      />
      <button
        onClick={wrap('user.preferences.notifications.email', (props) => {
          console.log('toggle email was ', props.stateProp);
          props.stateProp = !props.stateProp;
          console.log('toggle email is ', props.stateProp);
        })}
      >
        Toggle Email Notifications:{' '}
        {state.user.preferences.notifications.email ? 'OFF' : 'ON'}
      </button>
      <select
        value={state.user.preferences.theme}
        name="user.preferences.theme"
        onChange={acts.onChangeInput}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
```

</section>
<section className="relative space-y-2">

## Path-based Operations

`con-estado` supports flexible path notation for state updates:

```tsx
// Dot notation
set('user.preferences.theme', 'dark');

// Array notation
set(['user', 'preferences', 'theme'], 'dark');

// Array indices
set('todos[0].done', true);
set('todos[-1].text', 'Last item'); // Negative indices supported

// Array operations
merge('todos', [{done: true}]); // Merge first element in array
set('todos', []);            // Clear array
```

</section>
<section className="relative space-y-2">

### Path Update Methods

- [`set`](#set): Replace value at path
- [`merge`](#merge): Merge `object`s/`array`s at path
- [`wrap`](#wrap): Modify value using a callback that can return a value
- [`setHistory`](#sethistory): Set both `state` and `initial`
- [`mergeHistory`](#mergehistory): Merge into both `state` and `initial`

</section>
<section className="relative space-y-2">

## Custom Selectors

Custom Selector is a `function` that optimize renders by selecting only needed state:

```tsx
function UserPreferences() {
    const preferences = useCon( initialState, props => ( {
        theme: props.state.user.preferences.theme,
        updateTheme( event: ChangeEvent<HTMLSelectElement> ) {
          props.set(
            event.target.name as Parameter<typeof props.set>[0],
            event.target.value,
          );
        },
      } ),
    );
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

</section>
<section className="relative space-y-2">

## Actions

Define reusable actions for complex state updates:

```tsx
function PostList() {
  const [ state, { acts, } ] = useCon(
    { posts: [ { id: 1, text: 'post', } ] },
    {
      acts: ( { wrapSet, } ) => {

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
            set('posts', posts );
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

</section>
<section className="relative space-y-2">

## State History

Track and access previous state values:

- **state**: Current immutable state object.
- **prev**: The previous immutable `state` object before `state` was updated.
- **initial**: Immutable immutable initial state it started as. It can be updated through `historyDraft` for re-sync purposes,
such as merging with server data into `initial` while `state` keeps client side data.
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
<section className="relative space-y-2">

## To Do example

An complex to-do app example of how `con-estado` can be used.

[To Do Example](https://stackblitz.com/edit/con-estado-todont-app-fikb7k8w?ctl=1&embed=1&file=src%2Fstore%2Findex.ts)

</section>
<section className="relative space-y-2">

## Parameters API

`createConStore` and `useCon` take the same parameters.

</section>
<section className="relative space-y-2">

### 1. `initial`

```ts
// works with createConStore
useCon( {} );
useCon( () => ({}) );
useCon( [] );
useCon( () => ([]) );
```

Used to initialize the [`state`](#state) value. non-`null` `Object` with data, `Array`,
or a function that returns an `Object` or `Array`

</section>
<section className="relative space-y-2">

### 2. `options`

Configuration options for `createConStore` and `useCon`.

```ts
useCon( initial, options );
```

</section>
<section className="relative space-y-2">

#### 2.1. `options.acts`

Optional factory function for creating a Record of action handlers and state transformations.
The action handlers have access to a subset of the controls object.

**Return type**: `Record<string | number, (...args: unknown[]) => unknown>`

```ts
useCon(
  initial,
  {
    acts: ( {
      get,
      merge,
      mergeHistory,
      reset,
      set,
      setHistory,
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

<section className="relative space-y-2">

#### 2.2. `options.beforeChange`

Function to modify state before it's committed to history.
Enables validation, normalization, or transformation of state updates.

- **historyDraft**: A Mutative draft of `state` and `initial` that can be modified for additional changes.
- **history**: Immutable [State History](#state-history). Does not have latest changes.
- **type**: The operation type (`'set' | 'reset' | 'merge'`) that triggered changes.
- **patches**: A partial state object that contains the latest deeply nested changes made to `state` and/or `initial`.
  Useful for when you want to include additional changes based on what `patches` contains.

**Return type**: `void`

```tsx
useCon(initialState, {
  beforeChange: ({
    historyDraft, // Mutable draft of state and initial
    history,      // Current immutable state history
    type,         // Operation type: 'set' | 'reset' | 'merge'
    patches,      // Latest changes made to state/initial
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

<section className="relative space-y-2">

#### 2.3. `options.afterChange`

Post-change async callback function executed after state changes are applied.
Provides access to the updated [State History](#state-history)

**Return type**: `void`

```ts
useCon(
  initial,
  {
    afterChange(
      { state, initial, prev, prevInitial, changes, }
    ) {
      // your code with async support
    }
  }
);
```
</section>

<section className="relative space-y-2">

#### 2.4. `options.mutOptions`

Configuration for [`mutative` options](https://mutative.js.org/docs/api-reference/create#createstate-fn-options---options).

```tsx
useCon(initialState, {
  mutOptions: {
    // Mutative options (except enablePatches)
    strict: true,
    deep: true,
    // ... other Mutative options
  }
});
```

`{enablePatches: true}` not supported.

</section>

<section className="relative space-y-2">

### 3. `selector`

Custom `selector` callback that lets you shape what is returned from `useCon` and/or `createConStore`.

`useCon` Example:

```ts
useCon(
  initialState,
  options,
  ( {
    acts,
    get,
    merge,
    mergeHistory,
    reset,
    set,
    setHistory,
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
    get,
    merge,
    mergeHistory,
    reset,
    set,
    setHistory,
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
    ? controls.wrap('count')
    : () => {}
);

// Won't re-render, but it will do something.
const setCount = useCon( initialState, controls => (value) => {
  controls.state.count < 10
   ? controls.set('count', value)
   : undefined
});
```

```ts
// This will re-render when `controls.state.count` has updated. 
const setCount = useCon( initialState, controls => ({
  count: controls.state.count,
  setCount: controls.state.count < 10
   ? controls.wrap('count')
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
<section className="relative space-y-2">

## `useCon`

Local state manager for a React Component

```ts
const [ state, controls, ] = useCon( initialState, options, selector, );
```
</section>
<section className="relative space-y-2">

### `useSelector`

`useCon` has access to additional control property from `selector` named `useSelector`. A `function` that works like what `createConStore` returns.
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
   ? controls.wrap('count')
   : () => {}
);

// Won't re-render, but it will do something.
const setCount = useCon( initialState, controls => (value) => {
  controls.state.count < 10 ? controls.set('count', value) : undefined
});
```

```ts
// This will re-render when `controls.state.count` value is updated
const setCount = useCon( initialState, controls => ({
  count: controls.state.count,
  setCount: controls.state.count < 10 ? controls.wrap('count') : () => {}
}));
```

</section>
<section className="relative space-y-2">

## `createConStore`

Global store state manager.

```ts
const useConSelector = createConStore( initialState, options, selector, );
```

</section>
<section className="relative space-y-2">

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
  get,
  merge,
  mergeHistory,
  reset,
  set,
  setHistory,
  wrap,
  subscribe,
} = useConSelector
```

If a `selector` is provided from `createConStore` or `useConSelector`, it returns the result of the `selector`.

```ts
const yourSelection = useConSelector(
  ( {
    acts,
    get,
    merge,
    mergeHistory,
    reset,
    set,
    setHistory,
    wrap,
    state,
    subscribe,
  }, ) => unknown
);
```

</section>
<section className="relative space-y-2">

## Shared Controls API

The following `function`s
- [options.acts](#21-optionsacts)
- [selector](#3-selector)
- [useSelector](#useselector)
- [useConSelector](#useconselector)

have access to the following controls:

</section>
<section className="relative space-y-2">

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
const specificChange = get('changes.user.name');
```

</section>
<section className="relative space-y-2">

### `state`

The current immutable `state` value. Initialized from [options.initialState](#1-initial).

Same value as `get( 'state' )`. Provided for convenience and to trigger re-render on default selector update.

```ts
const [
  state,
] = useCon( { count: 0, }, );

const {
  state,
} = useConSelector(( { state, } ) => ( { state, }, ));
```

</section>
<section className="relative space-y-2">

### `set`

`set` provides multiple ways to update state values with a new state value or mutation callback.

```ts
const [
  state,
  { set, }
] = useCon( { count: 0, }, );

const {
  set,
} = useConSelector( ( { set, } ) => ( { set, }, ));
```

All `set` calls `return`s a new [State History](#state-history) `object`.

</section>
<section className="relative space-y-2">

#### Full Set State

Replace the entire `state` with a new value:

```tsx
// state = {
//   user: { name: 'John' },
//   count: 0
// };

set({
  user: { name: 'Jane' },
  count: 1
});

// state = {
//   user: { name: 'Jane' },
//   count: 1
// };
```

</section>
<section className="relative space-y-2">

#### Path-based Set

Update `state` at a specific path using dot-bracket notation:

```tsx
// state = {
//   user: {
//     profile: { name: 'John' },
//     settings: { theme: 'light' }
//   },
//   posts: ['post1', 'post2']
// };

// String path
set('user.profile.name', 'Jane');
// state.user.profile.name === 'Jane'

// Array path
set(['user', 'settings', 'theme'], 'dark');
// state.user.settings.theme === 'dark'

// Array indices
// state.posts[0] = 'updated post'
set('posts[0]', 'updated post');
// set(['posts', 0], 'updated post');

// Clear array
// state.posts = []
set('posts', []);
// set([ 'posts' ], []);
```

Negative indices are allowed, but they can't be out of bounds. E.g., `['posts', -1]` or `posts[-1]` is valid if 'posts' has at least one element.

```ts
// state = { posts: [ 
//  undefined, 
//  { title: 'Second post', content: 'Second post content', }, 
// ], }

set( 'posts[-1]', { title: 'Updated Second Title', });
// state = { posts: [ 
//  undefined, 
//  { title: 'Updated Second Title', content: 'Second post content', }, 
// ], }; 

set( [ 'posts', -2 ], { title: 'Updated First Content' }, );
// state = { posts: [
//  { title: 'Updated First Content', },
//  { title: 'Updated Second Title', content: 'Second post content', },
// ], }; 

set( 'posts[-3]', { title: 'Third Title', }, ); // throws error
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
set('count.path.invalid', 42); // Error: `count` is not an object.

// Out of bounds
set('posts[-999]', 'value'); // Error: Index out of bounds. Array size is 2.
```

</section>
<section className="relative space-y-2">

##### Set Special Character Paths

Keys containing dots `.`, or opening bracket `[` must be escaped with backslashes.

Does not apply to array path keys.

```ts
// state = {
//   path: {
//     'user.name[s]': 'Name',
//   },
// };

set( 'path.user\\.name\\[s]', 'New Name', );
// set( [ 'path', 'user.name[s]' ], 'New Name', );
```

</section>
<section className="relative space-y-2">

#### Set Non-existing Paths

When setting a value at a non-existing path, intermediate `object`s or `array`s are created automatically:

```tsx
// state = {
//   count: 1,
//};

set('deeply.nested.value', 42);
// state = {
//   deeply: {
//     nested: {
//       value: 42
//     }
//   }
// };

// Arrays are created when using numeric paths
set('items[0].name', 'First');
// state = {
//   items: [{ name: 'First' }]
// };
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
set('count.path.invalid', 42); // Error: `count` is not an object.

// Out of bounds
set('posts[-999]', 'value'); // Error: Index out of bounds. Array size is 2.
```

</section>
<section className="relative space-y-2">

#### Set Callback

Update `state` using a callback function that receives the current value:

```tsx
// state = { count: 1 };

set( 'count', (props) => props.draft += 1);
// state.count === 2

// With full state access
set( ({ draft }) => {
  draft.count += 1;
  draft.lastUpdated = Date.now();
});
```

</section>
<section className="relative space-y-2">

##### Set Callback Parameters

Contains [State History](#state-history) properties plus:
- **draft**: The mutable part of the `state` object that can be modified in the callback.
- **historyDraft**: Mutable `state` and `initial` object that can be modified in the callback.
- 
```ts
set( ( {
  draft, // Mutable state
  historyDraft, // Mutable state and initial
  state, // Immutable state
  prev, // Immutable previous state
  initial, // Immutable initial state
  prevInitial, // Immutable previous initial state
  changes, // Immutable changes
}, ) => {
  draft.value = 5;
  historyDraft.initial.value = 9
}, );
```

</section>
<section className="relative space-y-2">

##### Set Path-based Callback Parameters

Contains [State History](#state-history) properties plus:

- **draft**: The mutable part of the `state` value relative to path.
	- **ALERT**: When path leads to a primitive value, you must use mutate `draft` via non-destructuring.
		- i.e. `set( 'path.to.primitive', (props) => props.draft = 5 )`
- **stateProp**: The current immutable `state` value relative to path.
- **initialProp**: The `initial` immutable value relative to path.
- **prevProp**: The previous immutable `state` value relative to path. Can be `undefined`.
- **prevInitialProp**: The previous immutable `initial` value relative to path. Can be `undefined`.
- **changesProp**: Immutable changed value made to the `state` value relative to path. Can be `undefined`.

```ts
set( 'my.data', ( {
  // same as set( callback )
  historyDraft, state, prev, initial, prevInitial, changes,
  draft, // Mutable state value relative to path
  stateProp, // Immutable state value relative to path
  prevProp, // Immutable previous state value relative to path
  initialProp, // Immutable initial value relative to path
  prevInitialProp, // Immutable previous initial value relative to path
  changesProp, // Immutable changed value made to state value relative to path
}, ) => {
  // your code
}, );
```

</section>
<section className="relative space-y-2">

### `merge`

`merge` provides deep partial `object`/`array` merging capabilities with multiple ways to specify merge targets:

</section>
<section className="relative space-y-2">

#### Merge Partial State

Deeply merge partial state into current state:

```tsx
// state = {
  user: {
    profile: { firstName: 'John' },
    preferences: { theme: 'light' }
  }
};

merge({
  user: {
    profile: { lastName: 'Doe' },
    preferences: { theme: 'dark' }
  }
});

// state = {
//   user: {
//     profile: { firstName: 'John', lastName: 'Doe' },
//     preferences: { theme: 'dark' }
//   }
// };
```
</section>
<section className="relative space-y-2">

#### Path-based Merging

`merge` updates `state` at a specific `string` path, e.g. 'user.profile', in the history state using a dot-bracket-notation for path
or `array` of `string`s or `number`s (for `array`s).

```tsx
// state = {
//   user: {
//     profile: { name: 'John' },
//     settings: { notifications: { email: true } }
//   }
// };

// String path
merge( 'user.profile', { age: 30 } );
// state.user.profile === { name: 'John', age: 30 }

// Array path
merge( [ 'user', 'settings' ], { theme: 'dark' } );
// state.user.settings === { notifications: { email: true }, theme: 'dark' }
```

Negative indices are allowed, but they can't be out of bounds. E.g., `['posts', -1]` or `posts[-1]` is valid if 'posts' has at least one element.

```ts
// state = { posts: [ 
//  undefined, 
//  { title: 'Second post', content: 'Second post content', }, 
// ], }

merge( 'posts[-1]', { title: 'Updated Second Title', });
// state = { posts: [ 
//  undefined, 
//  { title: 'Updated Second Title', content: 'Second post content', }, 
// ], }; 

merge( [ 'posts', -2 ], { title: 'Updated First Content' }, );
// state = { posts: [
//  { title: 'Updated First Content', },
//  { title: 'Updated Second Title', content: 'Second post content', },
// ], }; 

merge( 'posts[-3]', { title: 'Third Title', }, ); // throws error
```

**Error Cases**

Throws errors in these situations:
- Type mismatches
- Trying to access non-object/array properties with dot-bracket notation
- Out of bounds negative indices

```ts
// state = {
//   count: 1,
//   posts: ['post1', 'post2']
// };

// Invalid paths
merge('count.path.invalid', 42); // Error: `count` is not an object.

// Invalid paths
merge( 'posts', { post: 'new post' } ); // Error: cannot merge object into array

// Out of bounds
merge('posts[-999]', 'value'); // Error: Index out of bounds. Array size is 2.
```

</section>
<section className="relative space-y-2">

##### Merge Special Characters in Paths

Keys containing dots `.`, or opening bracket `[` must be escaped with backslashes.

Does not apply to array path keys.

```ts
// state = {
//   path: {
//     'user.name[s]': 'Name',
//   },
// };

merge( 'path.user\\.name\\[s]', 'New Name', );
// merge( [ 'path', 'user.name[s]' ], 'New Name', );
```

</section>
<section className="relative space-y-2">

#### Merging Non-existing Paths

Automatically creates intermediate `object`s/`array`s:

```tsx
// state = {};

merge('nested.data', { value: 42 });
// state = {
//   nested: {
//     data: { value: 42 }
//   }
// };

merge('items[1]', { name: 'Second' });
// state = {
//   items: [
//     undefined,
//     { name: 'Second' }
//   ]
// };
```

</section>
<section className="relative space-y-2">

#### Merging Arrays

Special handling for array updates:

```tsx
// state = {
//   posts: [
//     { id: 1, title: 'First Post' },
//     { id: 2, title: 'Second Post', content: 'Original' }
//   ]
// };

// Update specific array elements using sparse arrays
merge('posts', [
  undefined,  // Skip first element
  { content: 'Updated' }  // Update second element
]);

// state.posts === [
//   { id: 1, title: 'First Post' },
//   { id: 2, title: 'Second Post', content: 'Updated' }
// ];

// Using negative indices
merge('posts[-1]', { status: 'published' });
// Updates last element

// Empty array merge does nothing
merge('posts', []); // No change. Use set( 'posts', [] ) to clear an array
```

</section>
<section className="relative space-y-2">

#### Merging Special Cases

1. Non-plain Objects:

```tsx
// Non-plain objects replace instead of merge
merge('date', new Date());  // Replaces entire value
merge('regex', /pattern/);  // Replaces entire value
```

2. Array Operations:

```tsx
// state = { items: [1, 2, 3] };

// To clear an array, use set instead
set('items', []);  // Correct way to clear
merge('items', []); // Does nothing
```

</section>
<section className="relative space-y-2">

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
<section className="relative space-y-2">

### `wrap`

`wrap` creates reusable state updater functions that can accept additional parameters. 
It supports three different usage patterns:

</section>
<section className="relative space-y-2">

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
<section className="relative space-y-2">

##### `wrap` Callback Parameters

Contains the following parameters:
1. **props**: [State History](#state-history) properties.
    - **state**: Mutable `state` object that can be modified in the callback.
    - **initial**: Mutable `initial` object that can be modified in the callback.
    - **prev**: Immutable `prev` object.
    - **prevInitial**: Immutable previous `initial` object.
    - **changes**: Immutable changes object.
2. **...args**: Additional arguments passed to the wrap

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
<section className="relative space-y-2">

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
//     posts: ['post1', ]
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
<section className="relative space-y-2">

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
<section className="relative space-y-2">

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
const yourUpdater = wrap('count.path.invalid', ( props, value ) => {
  props.stateProp = value;
}); 
yourUpdater( 42 ); // Error: `count` is not an object.

// Out of bounds
const outOfBoundsUpdater = wrap('posts[-999]', ( props, value ) => {
  props.stateProp = value;
});
outOfBoundsUpdater( 'value' );  // Error: Index out of bounds. Array size is 2.
```

</section>

<section className="relative space-y-2">

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
<section className="relative space-y-2">

#### `wrap` Return Values

Wrapped functions can return Promise-like or non-Promise values:

```tsx
// state = { items: [ 'a', 'b', 'c' ] }

const removeItem = wrap(
  ( { state }, index: number) => {
    const removed = state.items[index];
    state.items.splice(index, 1);
    return removed;
  }
);

// Usage
const removed = removeItem(1);  // returns 'b'
// state.items === [ 'a', 'c' ]
```

</section>
<section className="relative space-y-2">

### `mergeHistory`

Works like [merge](#merge), `mergeHistory` updates `state` or `initial`
at a specific path in the history `state` using an `array` of `string`s or `number`s (for `array`s).

```ts
// initial.user = {
//   profile: { firstName: 'John', },
//   preferences: { theme: 'light', },
// };

mergeHistory( {
  user: {
    profile: { lastName: 'Doe', },
    preferences: { theme: 'dark', },
  }
} );

// initial.user = {
//   profile: { firstName: 'John', lastName: 'Doe', },
//   preferences: { theme: 'dark', },
// };
```

</section>
<section className="relative space-y-2">

#### Path-based Merging History

`mergeHistory` updates `state` at a specific `string` path, e.g. 'user.profile', 
in the history state using a dot-bracket-notation for path or `array` of `string`s or `number`s (for `array`s).

```tsx
// initial = {
//   user: {
//     profile: { name: 'John' },
//     settings: { notifications: { email: true } }
//   }
// };

// String path
mergeHistory( 'initial.user.profile', { age: 30 } );
// state.user.profile === { name: 'John', age: 30 }

// Array path
mergeHistory( [ 'initial', 'user', 'settings' ], { theme: 'dark' } );
// initial.user.settings === { notifications: { email: true }, theme: 'dark' }
```

Negative indices are allowed, but they can't be out of bounds. E.g., `['posts', -1]` or `posts[-1]` is valid if 'posts' has at least one element.

```ts
// initial = { posts: [ 
//  undefined, 
//  { title: 'Second post', content: 'Second post content', }, 
// ], }

mergeHistory( 'initial.posts[-1]', { title: 'Updated Second Title', });
// initial = { posts: [ 
//  undefined, 
//  { title: 'Updated Second Title', content: 'Second post content', }, 
// ], }; 

mergeHistory( [ 'initial', 'posts', -2 ], { title: 'Updated First Content' }, );
// initial = { posts: [
//  { title: 'Updated First Content', },
//  { title: 'Updated Second Title', content: 'Second post content', },
// ], }; 

mergeHistory( 'initial.posts[-3]', { title: 'Third Title', }, ); // throws error
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
mergeHistory( 'initial.count.path.invalid', 42 ); // Error: `count` is not an object.

// Invalid paths
mergeHistory( 'initial.posts', { post: 'new post' } ); // Error: cannot merge object into array

// Out of bounds
mergeHistory( 'initial.posts[-999]', 'value'); // Error: Index out of bounds. Array size is 2.
```

</section>
<section className="relative space-y-2">

##### Merge History for Special Characters in Paths

Keys containing dots `.`, or opening bracket `[` must be escaped with backslashes.

Does not apply to array path keys.

```ts
// initial = {
//   path: {
//     'user.name[s]': 'Name',
//   },
// };

mergeHistory( 'initial.path.user\\.name\\[s]', 'New Name', );
// mergeHistory( [ 'initial', 'path', 'user.name[s]' ], 'New Name', );
```

</section>
<section className="relative space-y-2">

#### Merge History for Non-existing Path 

Automatically creates intermediate `object`s/`array`s:

```tsx
// initial = {};

mergeHistory( 'initial.nested.data', { value: 42 });
// initial = {
//   nested: {
//     data: { value: 42 }
//   }
// };

mergeHistory( 'initial.items[1]', { name: 'Second' });
// initial = {
//   items: [
//     undefined,
//     { name: 'Second' }
//   ]
// };
```

</section>
<section className="relative space-y-2">

#### Merge History for Arrays

Special handling for array updates:

```tsx
// initial = {
//   posts: [
//     { id: 1, title: 'First Post' },
//     { id: 2, title: 'Second Post', content: 'Original' }
//   ]
// };

// Update specific array elements using sparse arrays
mergeHistory( 'initial.posts', [
  undefined,  // Skip first element
  { content: 'Updated' }  // Update second element
]);

// initial.posts === [
//   { id: 1, title: 'First Post' },
//   { id: 2, title: 'Second Post', content: 'Updated' }
// ];

// Using negative indices
mergeHistory( 'initial.posts[-1]', { status: 'published' });
// Updates last element

// Empty array merge does nothing
mergeHistory( 'initial.posts', []); // No change. Use set( 'posts', [] ) to clear an array
```

</section>
<section className="relative space-y-2">

#### Merge History Special Cases

1. Non-plain Objects:

```tsx
// Non-plain objects replace instead of merge
mergeHistory( 'initial.date', new Date());  // Replaces entire value
mergeHistory( 'initial.regex', /pattern/);  // Replaces entire value
```

2. Array Operations:

```tsx
// initial = { items: [1, 2, 3] };

// To clear an array, use set instead
mergeHistory( 'initial.items', []); // Does nothing
setHistory( 'initial.items', []);  // Correct way to clear
```

</section>
<section className="relative space-y-2">

### `setHistory`

`setHistory` provides ways to update both `state` and `initial` values simultaneously:

</section>
<section className="relative space-y-2">

#### Full Set History

Replace both state and initial values:

```tsx
// state = { count: 1, items: ['old'] }
// initial = { count: 0, items: [] }

setHistory({
  state: { count: 5, items: ['new'] },
  initial: { count: 5, items: ['new'] }
});

// state = { count: 5, items: ['new'] }
// initial = { count: 5, items: ['new'] }
```

</section>
<section className="relative space-y-2">

#### Path-based Set History

Update specific paths in state or initial:

```tsx
// state = { user: { name: 'John', age: 25 }, items: ['one', 'two'] }
// initial = { user: { name: 'John', age: 20 } }

// String path
setHistory( 'state.user.age', 30);
// state.user.age === 30
// initial unchanged

setHistory( 'initial.user.age', 21);
// initial.user.age === 21
// state unchanged

// Set array
setHistory( 'state.items', ['three', 'four']);
// state.items === ['three', 'four']

// Set specific index
setHistory( 'state.items[0]', 'updated');
// state.items === ['updated', 'four']

// Array path
setHistory( ['state', 'user', 'name'], 'Jane');
// state.user.name === 'Jane'
```

Negative indices are allowed, but they can't be out of bounds. E.g., `['initial', 'posts', -1]` or `initial.posts[-1]`
is valid if 'posts' has at least one element.

```ts
// initial = { posts: [ 
//  undefined, 
//  { title: 'Second post', content: 'Second post content', }, 
// ], }

setHistory( 'initial.posts[-1]', { title: 'Updated Second Title', });
// initial = { posts: [ 
//  undefined, 
//  { title: 'Updated Second Title', content: 'Second post content', }, 
// ], }; 

setHistory( [ 'initial', 'posts', -2 ], { title: 'Updated First Content' }, );
// initial = { posts: [
//  { title: 'Updated First Content', },
//  { title: 'Updated Second Title', content: 'Second post content', },
// ], }; 

setHistory( 'initial.posts[-3]', { title: 'Third Title', }, ); // throws error
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
setHistory( 'initial.count.path.invalid', 42); // Error: `count` is not an object.

// Out of bounds
setHistory( 'initial.posts[-999]', 'value'); // Error: Index out of bounds. Array size is 2.
```

</section>
<section className="relative space-y-2">

##### Set History for Special Characters in Paths

Keys containing dots `.`, or opening bracket `[` must be escaped with backslashes.

Does not apply to array path keys.

```ts
// initial = {
//   path: {
//     'user.name[s]': 'Name',
//   },
// };

setHistory( 'initial.path.user\\.name\\[s]', 'New Name', );
// setHistory( [ 'initial', 'path', 'user.name[s]' ], 'New Name', );
```

</section>
<section className="relative space-y-2">

#### Set History for Non-existing Path

Automatically creates intermediate `object`s/`array`s:

```tsx
// state = {}
// initial = {}

setHistory('state.deeply.nested.value', 42);
// state = {
//   deeply: {
//     nested: {
//       value: 42
//     }
//   }
// }

// Arrays are created for numeric paths
setHistory( 'initial.items.0.name', 'First');
// initial = {
//   items: [{ name: 'First' }]
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
setHistory( 'initial.count.path.invalid', 42); // Error: `count` is not an object.

// Out of bounds
setHistory( 'initial.posts[-999]', 'value'); // Error: Index out of bounds. Array size is 2.
```

</section>
<section className="relative space-y-2">

#### Set History Callback

Update using callbacks with access to both state and initial:

```tsx
// state = { count: 1 }
// initial = { count: 0 }

// Full state callback
setHistory( ({ historyDraft }) => {
  historyDraft.state.count += 1;
  historyDraft.initial.count = 1;
});

// Path-specific callback
setHistory( 'state.count', (props) => {
  props.draft += 1;
});
```

</section>
<section className="relative space-y-2">

##### Set History Callback Parameters

The callback receives comprehensive history state access:

```tsx
setHistory(({
  historyDraft,  // Mutable state and initial
  state,         // Current immutable state
  initial,       // Current immutable initial
  prev,          // Previous immutable state
  prevInitial,   // Previous immutable initial
  changes,       // Immutable changes
}) => {
  historyDraft.state.count += 1;
  historyDraft.initial.lastReset = Date.now();
});
```

</section>
<section className="relative space-y-2">

##### Path-based Set History Callback Parameters

Contains [State History](#state-history) properties plus:

- **draft**: The mutable part of the `state` value relative to path.
	- **ALERT**: When path leads to a primitive value, you must use mutate `draft` via non-destructuring.
		- i.e. `setHistory( 'initial.path.to.primitive', (props) => props.draft = 5 )`
- **stateProp**: The current immutable `state` value relative to path.
- **initialProp**: The `initial` immutable value relative to path.
- **prevProp**: The previous immutable `state` value relative to path. Can be `undefined`.
- **prevInitialProp**: The previous immutable `initial` value relative to path. Can be `undefined`.
- **changesProp**: Immutable changed value made to the `state` value relative to path. Can be `undefined`.

```ts
setHistory( 'initial.my.data', ( {
  // same as set( callback )
  historyDraft, state, prev, initial, prevInitial, changes,
  draft, // Mutable state value relative to path
  stateProp, // Immutable state value relative to path
  prevProp, // Immutable previous state value relative to path
  initialProp, // Immutable initial value relative to path
  prevInitialProp, // Immutable previous initial value relative to path
  changesProp, // Immutable changed value made to state value relative to path
}, ) => {
  // your code
}, );
```

</section>
<section className="relative space-y-2">

### `reset`

Resets `state` to `initial`.
Returns [State History](#state-history) with `initial` set to `state` values.

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
<section className="relative space-y-2">

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
<section className="relative space-y-2">

## Credits to

- [Mutative](https://mutative.js.org/) for efficient immutable updates
- [Immer](https://immerjs.github.io/immer/) for inspiring Mutative
- [Zustand](https://github.com/pmndrs/zustand) for the inspiration
- Øivind Loe for reminding me why I wanted to create a state management library.

</section>
