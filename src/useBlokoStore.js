import { useMemo } from 'react';
import { globalState } from '@bloko/js';
import useBlokoContext from './useBlokoContext';
import identity from './utils/identity';
import isPromise from './utils/isPromise';

function useActions(actions, context) {
  const _actions = Object.keys(actions).reduce((acc, actionName) => {
    const action = actions[actionName];

    acc[actionName] = function execute(payload) {
      const result = action(context, payload);

      if (isPromise(result)) {
        return result.then(identity);
      }

      return result;
    };

    return acc;
  }, {});

  // Necessary to safely use inside useEffects
  const memoActions = useMemo(() => _actions, []);

  return memoActions;
}

function useBloko(bloko) {
  const { state, dispatch } = useBlokoContext();
  const { key: namespace, actions } = bloko;

  const context = {
    getState: globalState.getState,
    commit: createCommit(dispatch, namespace),
  };

  const blokoState = state[namespace];
  const blokoActions = useActions(actions, context);

  return [blokoState, blokoActions];
}

function createCommit(dispatch, namespace) {
  return function (payload) {
    Object.keys(payload).forEach(name => {
      dispatch({
        type: name,
        meta: {
          namespace,
          payload: payload[name],
        },
      });
    });
  };
}

export default useBloko;
