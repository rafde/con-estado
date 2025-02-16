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

`con-estado` is a state management library built on top of [Mutative](https://mutative.js.org/), like [Immer](https://immerjs.github.io/immer/) but faster,
with the goal of helping with deeply nested state management in your application.

## Why Use `con-estado`?

Managing deeply nested state in React often becomes cumbersome with traditional state management solutions. `con-estado` provides:

- **Direct path updates** - Modify nested properties using dot notation or `Array<string | number>` instead of spreading multiple levels
- **Referential stability** - Only modified portions of state create new references, preventing unnecessary re-renders
- **Custom selectors** - Prevent component re-renders by selecting only relevant state fragments
- **Type-safe mutations** - Full TypeScript support for state paths and updates

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
			theme: 'dark',
			notifications: {
				email: true,
				push: false,
			},
		},
	},
	posts: [],
};

function MyComponent() {
	const [ state, { setWrap, } ] = useCon( initialState, );

	return (
		<div>
			<h1>
				Welcome {state.user.name}
			</h1>
			<button onClick={setWrap('user.preferences.notifications.email', (props) => props.draft = !props.stateProp)}>
				Toggle Email Notifications
			</button>
		</div>
	);
}
```
## Global Store

For applications needing global state management, `createConStore` provides a solution for creating actions and optimized updates:

```tsx
import { createConStore } from 'con-estado';

type CounterState = {
  count: number;
}

const useSelector = createConStore<CounterState>({
  count: 0,
}, {
  acts: ({ set }) => ({
	increment() {
		set(({ draft, }, ) => {
			draft.count++;
		}, );
	},
	asyncIncrement() {
	  return new Promise(resolve => {
		setTimeout(() => {
		  set('state', ({ draft, }, ) => {
			draft.count++;
		  }, );
		  resolve();
		}, 100);
	  });
	},
	incrementBy(amount: number) {
		set(({ draft, }, ) => {
			draft.count += amount;
		}, );
	},
  }),
});

// In component
function Counter() {
  const { count } = useSelector(props => props.state);
  const { increment, asyncIncrement, incBy5 } = useSelector(
	({acts: {increment, asyncIncrement, incrementBy}}) => ({increment, asyncIncrement, incBy5(){ incrementBy(5) }})
  );

  return (
	<div>
	  <h2>Count: {count}</h2>
	  <button onClick={increment}>Increment</button>
	  <button onClick={asyncIncrement}>Async Increment</button>
	  <button onClick={incBy5}>
		Add 5
	  </button>
	</div>
  );
}
```

Key advantages:
- **Global state** accessible across components
- **Pre-bound actions** with type-safe parameters
- **Async action support** with automatic state updates
- **Optimized subscriptions** through selector-based consumption

## Local State

Local state management.

```tsx
const [state, controls] = useCon(initialState, options?);
```

You get the advantages of `createConStore` but with local state.

## Advanced Usage

### Custom Selectors

Optimize renders by selecting only needed state:

```tsx
function UserPreferences() {
	const preferences = useCon( initialState, {
		selector: props => ( {
			theme: props.state.user.preferences.theme,
			updateTheme: props.setWrap(
				'user.preferences.theme', ( props, event: ChangeEvent<HTMLSelectElement>, ) => props.draft = event.target.value,
			),
		} ),
	} );
	return (
		<select
			value={preferences.theme}
			onChange={preferences.updateTheme}
		>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
	);
}
```

Selector is a function that returns the state you need. Only re-renders on non-function changes.

### Actions

Define reusable actions for complex state updates:

```tsx
function PostList() {
	const [state, { acts }] = useCon({posts: [{id: 1, text: 'post'}]}, {
		acts: ({ currySet, wrapSet }) => {
			// currySet is a function that returns a function that can be called with the posts array
			const setPost = currySet('posts');

			return {
				addPost(post: Post) {
					setPost(({ draft }) => {
						draft.push(post);
					});
				},
				updatePost: wrapSet('posts', ({draft}, id: number, updates: Partial<Post>) => {
					// draft is a mutable object that is relative to the state.posts array
					const post = draft.find(p => p.id === id);
					if (post) Object.assign(post, updates);
				}),
				async fetchPosts() {
					const posts = await api.getPosts();
					setPost( posts );
				}
			}
		}
	});

	return (
		<div>
			{state.posts.map(post => (
				<PostItem 
					key={post.id} 
					post={post}
					onUpdate={updates => acts.updatePost(post.id, updates)}
				/>
			))}
	
			<button onClick={() => acts.fetchPosts()}>
				Refresh Posts
			</button>
		</div>
	);
}
```

### State History

Track and access previous state values:

```tsx
function StateHistory() {
	const [state, { get, reset }] = useCon(initialState);
	
	const history = get(); // Get full state history
	const prev = history.prev;
	
	return (
		<div>
			<pre>{JSON.stringify(prev, null, 2)}</pre>
			<button onClick={reset}>Reset State</button>
		</div>
	);
}
```

## API Reference

`createConStore` and `useCon` take the same parameters.

### createConStore and useCon Options Overview

1. **initial**: non-null Object with data, Array, or a function that returns an Object or Array
2. **options**: Configuration options for `createConStore` and `useCon`.
	- **acts**: Callback `function` for creating the actions object. The action functions can be called with the `controls` object.
	- **afterChange**: Async callback after state changes
	- **mutOptions**: Configuration for [`mutative` options](https://mutative.js.org/docs/api-reference/create#createstate-fn-options---options). `{enablePatches: true}` not supported.
	- **transform**: Callback `function` to transform the `state` and/or `initial` properties before it is set/reset. Receives a draft and current history
3. **selector**: Custom state selector function that lets you shape what is returned from `useCon` and `createConStore`

### createConStore

Global store for state management.

```ts
const useConSelector = createConStore(initialState, options, selector);

const [state, controls] = useConSelector(selectorOverride);
```

### useCon

Local state management.

```ts
const [state, controls] = useCon(initialState, options, selector);
```

### createConStore and useCon Controls Overview

- **set**: A `function` to update `state` properties
- **currySet**: Get a function to specify which part of `state` you want to update by currying `set(path)`
- **setWrap**: Lets you wrap `set` around a function that will be called with the draft value to update.
- **acts**: Custom defined actions
- **get**: Get current state or value at path
- **reset**: Reset state to initial
- **getDraft**: Get mutable draft of `state` and/or `initial` properties
- **setHistory**: A function to update `state` and/or `initial` properties
- **currySetHistory**: Get a function to specify which part of `state` and/or `initial` you want to update by currying `setHistory(path)`
- **setHistoryWrap**: Lets you wrap `setHistory` around a function that will be called with the draft value to update.

## TypeScript Support

`con-estado` is written in TypeScript and can infer the state and actions types:

```ts
const [state, { set }] = useCon({
	user: {
		name: 'John',
		preferences: {
			theme: 'light' as 'light' | 'dark',
			notifications: { email: true, push: false }
		}
	},
	posts: [] as string[]
});
```

## Credits to

- [Mutative](https://mutative.js.org/) for efficient immutable updates
- [Immer](https://immerjs.github.io/immer/) for inspiring Mutative
- [Zustand](https://github.com/pmndrs/zustand) for the inspiration
- Øivind Loe for reminding me why I wanted to create a state management library.
