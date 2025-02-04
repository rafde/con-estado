# estado

[![NPM License](https://img.shields.io/npm/l/estado)](/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/estado)](https://www.npmjs.com/package/estado)
[![JSR Version](https://img.shields.io/jsr/v/%40rafde/estado)](https://jsr.io/@rafde/estado)
![Test](https://github.com/rafde/estado/actions/workflows/test.yml/badge.svg)

[Full docs](https://rafde.github.io/estado)

## Installation

```shell
npm i estado
```

```shell
yarn add estado
```

```shell
deno add jsr:@rafde/estado
```

## Introduction

`estado` is a state management library built on top of [Mutative](https://mutative.js.org/) with the goal of helping with deeply nested state management in your application.

## Why Use estado?

Managing deeply nested state in React often becomes cumbersome with traditional state management solutions. `estado` provides:

- **Direct path updates** - Modify nested properties using dot notation instead of spreading multiple levels
- **Referential stability** - Only modified portions of state create new references, preventing unnecessary re-renders
- **Zero boilerplate actions** - Built-in atomic mutations with automatic action creation
- **Optimized selectors** - Prevent component re-renders by selecting only relevant state fragments
- **Type-safe mutations** - Full TypeScript support for state paths and updates

Built on `Mutative`'s efficient immutable updates, `estado` is particularly useful for applications with:
- Complex nested state structures
- Performance-sensitive state operations
- Frequent partial state updates
- Teams wanting to reduce state management boilerplate

## Basic Usage

```tsx
import { useCon } from 'estado';
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
	const [ state, { set, } ] = useCon( initialState, );
	// Update deeply nested state
	const toggleEmailNotifications = () => {
		set( 'state.user.preferences.notifications.email', !state.user.preferences.notifications.email, );
	};
	return (
		<div>
			<h1>
				Welcome {state.user.name}
			</h1>
			<button onClick={toggleEmailNotifications}>
				Toggle Email Notifications
			</button>
		</div>
	);
}
```
## Global Store

For applications needing global state management, `createConStore` provides a solution with built-in actions and optimized updates:

```tsx
import { createConStore } from 'estado';

type CounterState = {
  count: number;
}

const useSelector = createConStore<CounterState>({
  count: 0,
}, {
  acts: ({ set }) => ({
	increment() {
		set('state', ({stateProp}) => {stateProp.count++});
	},
	asyncIncrement() {
	  return new Promise(resolve => {
		setTimeout(() => {
		  set('state', ({stateProp}) => {stateProp.count++});
		  resolve();
		}, 100);
	  });
	},
	incrementBy(amount: number) {
		set('state', ({stateProp}) => {stateProp.count+= amount});
	},
  }),
});

// In component
function Counter() {
  const { count } = useSelector(props => props.state);
  const { increment, asyncIncrement } = useSelector(props => props.acts);

  return (
	<div>
	  <h2>Count: {count}</h2>
	  <button onClick={increment}>Increment</button>
	  <button onClick={asyncIncrement}>Async Increment</button>
	  <button onClick={() => counterStore.acts.incrementBy(5)}>
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

## Custom Selectors

Optimize renders by selecting only needed state:

## Advanced Usage

### Custom Selectors

Optimize renders by selecting only needed state:

```tsx
function UserPreferences() {
	const preferences = useCon( initialState, {
		selector: props => ( {
			theme: props.state.user.preferences.theme,
			updateTheme: ( newTheme: string ) => props.set( 'state.user.preferences.theme', newTheme, ),
		} ),
	} );
	return (
		<select
			value={preferences.theme}
			onChange={e => preferences.updateTheme( e.target.value, )}
		>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
	);
}
```

### Actions

Define reusable actions for complex state updates:

```tsx
function PostList() {
	const [state, { acts }] = useCon(initialState, {
		acts: ({ set }) => ({
			addPost(post: Post) {
				set('state.posts', ({ draft }) => {
					draft.push(post);
				});
			},
			updatePost(id: number, updates: Partial<Post>) {
				set('state.posts', ({ draft }) => {
					const post = draft.find(p => p.id === id);
					if (post) Object.assign(post, updates);
				});
			},
			async fetchPosts() {
				const posts = await api.getPosts();
				set('state.posts', posts);
			}
		})
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
	const previousState = history.priorState;
	
	return (
		<div>
			<pre>{JSON.stringify(previousState, null, 2)}</pre>
			<button onClick={reset}>Reset State</button>
		</div>
	);
}
```

## API Reference

### useCon

```ts
const [state, controls] = useCon(initialState, options?);
```

#### Options

- `selector`: Custom state selector function
- `acts`: Action creators object. The action functions are defined in the `acts` property and can be called with the `controls` object.
- `compare`: Custom comparison function
- `afterChange`: Callback after state changes

### Controls

- `set(path, value)`: Update state at path
- `get(path?)`: Get current state or value at path
- `reset()`: Reset state to initial
- `acts`: Custom defined actions
- `getDraft()`: Get mutable draft state

## TypeScript Support

estado is written in TypeScript and can infer the state and actions types:

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
