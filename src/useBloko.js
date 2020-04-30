import { getBloko } from '@bloko/js';
import useBlokoContext from './useBlokoContext';

function useState(namespace) {
  const { state } = useBlokoContext();

  return state[namespace];
}

function useActions(namespace) {
  const { state, dispatch } = useBlokoContext();
  const commit = createCommit(dispatch, namespace);
  const { actions } = getBloko(namespace);
  const namespacedState = state[namespace];
  const actionNames = Object.keys(actions);
  const context = { state, commit };

  const syncActions = Object.keys(namespacedState).reduce((acc, name) => {
    const mustSkip = actionNames.indexOf(name) > -1 || /^isloading/i.test(name);

    if (mustSkip) {
      return acc;
    }

    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    acc[`set${capitalizedName}`] = payload => commit({ [name]: payload });

    return acc;
  }, {});

  const asyncActions = Object.keys(actions).reduce((acc, actionName) => {
    const action = actions[actionName];

    acc[actionName] = (payload, repositoryOptions) => {
      return action(context, payload, repositoryOptions);
    };

    return acc;
  }, {});

  return {
    ...syncActions,
    ...asyncActions,
  };
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

function useBloko(namespace) {
  const state = useState(namespace);
  const actions = useActions(namespace);

  return [state, actions];
}

export default useBloko;
