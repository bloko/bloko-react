import React, { useReducer } from 'react';
import { globalState } from '@bloko/js';
import context from './utils/context';

const { Provider } = context;

function BlokoProvider({ children, blokos }) {
  if (globalState.isEmpty()) {
    blokos.forEach(bloko => {
      globalState.setState(bloko.key, bloko.state);
    });
  }

  function reducer(state, action) {
    const { payload, namespace } = action.meta;
    const partialState = state[namespace];
    const blokoName = action.type;

    const nextState = {
      ...state,
      [namespace]: {
        ...partialState,
        [blokoName]: payload,
      },
    };

    globalState.setNextState(nextState);

    return nextState;
  }

  const [state, dispatch] = useReducer(reducer, globalState.getState());

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
}

export default BlokoProvider;
