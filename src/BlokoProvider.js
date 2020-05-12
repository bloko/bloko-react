import React, { useReducer } from 'react';
import { globalState } from '@bloko/js';
import context from './utils/context';
import getType from './utils/getType';
import isObject from './utils/isObject';

const { Provider } = context;

function BlokoProvider({ children, blokos }) {
  if (globalState.isEmpty()) {
    blokos.forEach(bloko => {
      globalState.setState(bloko.key, bloko.state);
    });
  }

  const initialState = globalState.getState();

  function reducer(state, action) {
    const { payload, namespace } = action.meta;
    const partialState = state[namespace];
    const blokoName = action.type;

    let nextBlokoState = payload;

    if (payload === null || payload === undefined) {
      const blokoInitialState = initialState[namespace][blokoName];

      nextBlokoState = blokoInitialState;
    } else if (
      isObject(partialState && partialState[blokoName]) &&
      isObject(payload)
    ) {
      nextBlokoState = { ...partialState[blokoName], ...payload };
    } else {
      const payloadType = getType(payload);
      const initialType = getType(initialState[namespace][blokoName]);

      if (payloadType !== initialType) {
        // TODO: warn user on miss match types

        return state;
      }
    }

    const nextState = {
      ...state,
      [namespace]: {
        ...partialState,
        [blokoName]: nextBlokoState,
      },
    };

    globalState.setNextState(nextState);

    return nextState;
  }

  const [state, dispatch] = useReducer(reducer, globalState.getState());

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
}

export default BlokoProvider;
