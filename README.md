<p align="center">
  <a href="https://bloko.dev">
  <br />
  <img src="https://user-images.githubusercontent.com/7120471/80561131-d98be300-89b9-11ea-9956-679a406a387e.png" alt="Logo Bloko" height="60"/>
  <br />
    <sub><strong>Build modular applications with JavaScript</strong></sub>
  <br />
  <br />
  <br />
  </a>
</p>

[![Travis build][travis-image]][travis-url]
[![Codecov coverage][codecov-image]][codecov-url]
[![NPM version][npm-image]][npm-url]

[codecov-url]: https://codecov.io/gh/bloko/bloko-react
[codecov-image]: https://codecov.io/gh/bloko/bloko-react/branch/master/graphs/badge.svg
[travis-image]: https://img.shields.io/travis/com/bloko/bloko-react.svg?branch=master
[travis-url]: https://img.shields.io/travis/com/bloko/bloko-react
[npm-url]: https://npmjs.com/package/@bloko/react
[npm-image]: https://img.shields.io/npm/v/@bloko/react.svg

Bloko is currently under heavy development, but can be installed by running:

```sh
npm install --save @bloko/react
```

## Quick example

```js
import React, { useState } from 'react';
import Bloko, { useBlokoStore } from '@bloko/react';

const User = Bloko.create({
  name: '',
});

const Store = Bloko.createStore({
  key: 'store',
  state: {
    user: {
      type: User,
      setter: true,
    },
  },
  actions: {},
});

function App() {
  const [state, actions] = useBlokoStore(Store);
  const [name, setName] = useState('');

  function saveName() {
    actions.setUser({ name });
  }

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={saveName}>Save</button>
      <div>User store name: {state.user.name}</div>
    </div>
  );
}
```

## Bloko Provider

To give [`@bloko/js`](https://github.com/bloko/bloko-js) the necessary context to work properly `Bloko.Provider` will have to be used on root app React component.

`Bloko.Provider` is a React Component and needs an array of [Bloko Store](https://github.com/bloko/bloko-js#blokos-store).

```js
// React entry file
import React from 'react';
import ReactDOM from 'react-dom';
import Bloko from '@bloko/react';
import App from './App';
import Auth from './blokos/Auth';
import Users from './blokos/Users';

const blokos = [Auth, Users];

ReactDOM.render(
  <Bloko.Provider blokos={blokos}>
    <App />
  </Bloko.Provider>,
  document.getElementById('root')
);
```

## API

### `useBloko(bloko)`

A [React hook](https://reactjs.org/hooks) that helps handle Bloko units.

**Arguments**

- `bloko` - a [Bloko Unit](https://github.com/bloko/bloko-js#blokos-unit) instance

**Returns** a tuple of `[state, update]`:

- `state` - Represents the current state of the Bloko Unit
- `update(value: any)` - A function to ease updates on Bloko Unit using partial states, full states or new value instance.

**Example**

```js
import React from 'react';
import Bloko, { useBloko } from '@bloko/react';

const Child = Bloko.create({
  name: '',
});

const Parent = Bloko.create({
  name: '',
  child: Child,
});

function App() {
  const [parent, setParent] = useBloko(Parent);
  // => null

  // You could be more explicit using initial: false
  const [parent, setParent] = useBloko({ type: Parent, initial: false });
  // => null

  // Use initial: true to start with an object with default values
  const [parent, setParent] = useBloko({ type: Parent, initial: true });
  // => { name: '', child: { name: '' } }

  setParent({ name: 'Parent' });
  // => { name: 'Parent', child: { name: '' } }

  // Partial states are allowed
  setParent({ child: { name: 'Child' } });
  // => { name: 'Parent', child: { name: 'Child' } }

  setParent(null);
  // => null

  // When updates coming through null state
  // Bloko instance will be called again
  // and set result with default values
  setParent({ name: 'Parent' });
  // => { name: 'Parent', child: { name: '' } }
}
```

### `useBlokoStore(blokoStore)`

A [React hook](https://reactjs.org/hooks) that subscribes to state changes from an existing Bloko Store and also provide its actions to allow user interactions.

**Arguments**

- `blokoStore` - a [Bloko Store](https://github.com/bloko/bloko-js#blokos-store) instance

**Returns** a tuple of `[state, actions]`:

- `state` - Represents the current state of the Bloko Store. It is a partial representation of global state.
- `actions` - A collection of Bloko Store functions to interact with global state.

**Example**

```js
import React from 'react';
import Bloko, { useBlokoStore } from '@bloko/react';

const User = Bloko.create({
  name: '',
});

const Store = Bloko.createStore({
  key: 'store',
  state: {
    user: {
      type: User,
      setter: true,
    },
  },
  actions: {
    getUser: {
      // Simulate an async request with data.name
      request: () =>
        Promise.resolve({
          data: { name: 'John' },
        }),
      resolved(data) {
        return {
          user: {
            name: data.name,
          },
        };
      },
    },
  },
});

function App() {
  const [state, actions] = useBlokoStore(Store);

  // => state { user: { name: '' }, getUser: { loading: undefined, error: '' } }
  // => actions { setUser(), getUser() }
}
```
