import React, { useReducer } from 'react';
import { getState, combine } from '@bloko/js';
import context from './utils/context';

const { Provider } = context;

let combined = false;

function BlokoProvider({ children, blokos, models }) {
  if (!combined) {
    combine({ blokos, models });
    combined = true;
  }

  const [state, dispatch] = useReducer((state, action) => {
    const { payload, namespace } = action.meta;
    const partialState = state[namespace];
    const modelName = action.type;
    const _payload = isFunction(payload)
      ? payload(partialState && partialState[modelName])
      : payload;

    const isMismatchObjectType =
      !isObject(_payload) && isObject(partialState && partialState[modelName]);

    if (isMismatchObjectType) {
      // TODO: throw an error to be more developer friendly
      return state;
    }

    let nextModelState = _payload;

    if (
      isObject(nextModelState) &&
      isObject(partialState && partialState[modelName])
    ) {
      // TODO: improve copy for deep objects payload and partialStates
      nextModelState = { ...partialState[modelName], ...nextModelState };
    }

    const nextState = {
      ...state,
      [namespace]: {
        ...partialState,
        [modelName]: nextModelState,
      },
    };

    return nextState;
  }, getState());

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
}

function isObject(value) {
  return !!(value && typeof value === 'object' && !Array.isArray(value));
}

function isFunction(value) {
  return typeof value === 'function';
}

export default BlokoProvider;
