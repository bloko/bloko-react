import React, { useReducer } from 'react';
import { globalState } from '@bloko/js';
import context from './utils/context';
import getType from './utils/getType';
import isObject from './utils/isObject';
import recursiveUpdate from './utils/recursiveUpdate';
import tip from './utils/tip';
import warn from './utils/warn';

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

    const payloadType = getType(payload);
    const initialType = getType(initialState[namespace][blokoName]);

    if (payloadType !== initialType) {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        warn(
          `Cannot update ${namespace} store in ${blokoName} state. Missmatch types. ${blokoName} is ${initialType} type and payload is ${payloadType} type.`
        );

        if (payload === null || payload === undefined) {
          const capitalizedName =
            blokoName.charAt(0).toUpperCase() + blokoName.slice(1);

          tip(
            `Instead of actions.set${capitalizedName}(null) or actions.set${capitalizedName}(undefined), use actions.reset${capitalizedName}()`
          );
        }
      }

      return state;
    }

    if (
      isObject(partialState && partialState[blokoName]) &&
      isObject(payload)
    ) {
      nextBlokoState = Object.assign({}, partialState[blokoName]);

      recursiveUpdate(payload, nextBlokoState);
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
