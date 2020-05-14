import React from 'react';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Bloko, { globalState } from '@bloko/js';
import { getStateText, getActionsText } from './test-utils/helpers';
import renderWithBloko from './test-utils/render';
import useBlokoStore from './useBlokoStore';

beforeEach(() => {
  globalState.clear();
});

const stateUser = 'user';
const storeKey = 'auth';
const asyncAction = 'asyncAction';
const setterUserName =
  'set' + stateUser.charAt(0).toUpperCase() + stateUser.slice(1);
const repository = jest.fn(v => v);
const resolved = jest.fn(data => ({
  [stateUser]: {
    name: data.name,
  },
}));

const User = Bloko.create({
  name: '',
});

const Auth = Bloko.createStore({
  key: storeKey,
  state: {
    [stateUser]: {
      type: User,
      setter: true,
    },
  },
  actions: {
    [asyncAction]: {
      repository,
      resolved,
    },
  },
});

const renderOptions = { blokos: [Auth] };

describe('useBlokoStore', () => {
  it('should render correct interface for state and actions', () => {
    function Tree() {
      const [state, actions] = useBlokoStore(Auth);

      return (
        <React.Fragment>
          <div>{getStateText(state)}</div>
          <div>{getActionsText(actions)}</div>
        </React.Fragment>
      );
    }

    const { getByText } = renderWithBloko(<Tree />, renderOptions);

    const stateExpected = {
      user: {
        name: '',
      },
      [asyncAction]: {
        loading: false,
        error: '',
      },
    };

    const dispatchExpected = {
      [setterUserName]: jest.fn(),
      [asyncAction]: jest.fn(),
    };

    getByText(getStateText(stateExpected));
    getByText(getActionsText(dispatchExpected));
  });

  it('should render correct interface for state arrays and actions', async () => {
    const buttonText = 'Submit';

    const AuthArray = Bloko.createStore({
      key: storeKey,
      state: {
        [stateUser]: User.Array,
      },
      actions: {
        [asyncAction]: {
          repository(v) {
            return Promise.resolve(v);
          },
          resolved(data) {
            return {
              [stateUser]: data,
            };
          },
        },
      },
    });

    function Tree() {
      const [loading, setLoading] = React.useState(false);
      const [state, actions] = useBlokoStore(AuthArray);

      async function onClick() {
        const arrayUser = [User(), User()];

        setLoading(true);

        await actions[asyncAction](arrayUser);

        setLoading(false);
      }

      return (
        <React.Fragment>
          {loading ? null : <div>{getStateText(state)}</div>}
          <button onClick={onClick}>{buttonText}</button>
        </React.Fragment>
      );
    }

    const { getByText, findByText } = renderWithBloko(<Tree />, {
      blokos: [AuthArray],
    });

    const stateExpected = {
      [stateUser]: [User(), User()],
      [asyncAction]: {
        loading: false,
        error: '',
      },
    };

    await act(async () => {
      await userEvent.click(getByText(buttonText));

      await findByText(getStateText(stateExpected));
    });
  });

  it('should update state with set actions', async () => {
    const expectedModelName = 'expectedFooName';
    const buttonText = 'Submit';

    function Tree() {
      const [state, actions] = useBlokoStore(Auth);

      function onClick() {
        actions[setterUserName]({ name: expectedModelName });
      }

      return (
        <React.Fragment>
          <span>{state[stateUser].name}</span>
          <button onClick={onClick}>{buttonText}</button>
        </React.Fragment>
      );
    }

    const { getByText, queryByText } = renderWithBloko(<Tree />, renderOptions);

    expect(queryByText(expectedModelName)).toBeNull();

    await userEvent.click(getByText(buttonText));

    expect(queryByText(expectedModelName)).toBeInTheDocument();
  });

  it('should update state with set actions using callback functions', async () => {
    const expectedModelName = 'expectedFooName';
    const buttonText = 'Submit';

    function Tree() {
      const [state, actions] = useBlokoStore(Auth);

      function onClick() {
        actions[setterUserName](() => ({ name: expectedModelName }));
      }

      return (
        <React.Fragment>
          <span>{state[stateUser].name}</span>
          <button onClick={onClick}>{buttonText}</button>
        </React.Fragment>
      );
    }

    const { getByText, queryByText } = renderWithBloko(<Tree />, renderOptions);

    expect(queryByText(expectedModelName)).toBeNull();

    await userEvent.click(getByText(buttonText));

    expect(queryByText(expectedModelName)).toBeInTheDocument();
  });

  it('should update state after async action has been resolved', async () => {
    const buttonText = 'Submit';
    const expectedUserName = 'newName';

    function Tree() {
      const [state, actions] = useBlokoStore(Auth);
      const [isLoading, setIsLoading] = React.useState(false);

      async function onClick() {
        // updating FooModel.name
        setIsLoading(true);

        try {
          await actions[asyncAction]({ name: expectedUserName });
        } catch (error) {
          // noop
        } finally {
          setIsLoading(false);
        }
      }

      return (
        <React.Fragment>
          {isLoading ? (
            <span>Carregando...</span>
          ) : (
            <span>{state[stateUser].name}</span>
          )}
          <button onClick={onClick}>{buttonText}</button>
        </React.Fragment>
      );
    }

    const { getByText, findByText } = renderWithBloko(<Tree />, renderOptions);

    await act(async () => {
      await userEvent.click(getByText(buttonText));

      const element = await findByText(expectedUserName);

      expect(element).toBeInTheDocument();
      expect(repository).toHaveBeenCalledTimes(1);
      expect(repository).toHaveBeenCalledWith({ name: expectedUserName });
    });
  });

  it('should not update state when has mismatch types', async () => {
    const expectedModelName = 'expectedFooName';
    const buttonUndefined = 'SubmitUndefined';
    const buttonString = 'SubmitString';
    const buttonFunctionString = 'SubmitFunctionString';

    function Tree() {
      const [state, actions] = useBlokoStore(Auth);

      function onClickUndefined() {
        // trying to update partial object state with undefined value. Reset to initial state
        actions[setterUserName]();
      }

      function onClickString() {
        // trying to update partial object state with primitive string
        actions[setterUserName](expectedModelName);
      }

      function onClickFunctionString() {
        // trying to update partial object state with function
        // which resolves to primitive string
        actions[setterUserName](() => expectedModelName);
      }

      return (
        <React.Fragment>
          <span>{state[stateUser].name}</span>
          <button onClick={onClickUndefined}>{buttonUndefined}</button>
          <button onClick={onClickString}>{buttonString}</button>
          <button onClick={onClickFunctionString}>
            {buttonFunctionString}
          </button>
        </React.Fragment>
      );
    }

    const { getByText, queryByText } = renderWithBloko(<Tree />, renderOptions);

    expect(queryByText(expectedModelName)).toBeNull();

    userEvent.click(getByText(buttonUndefined));
    userEvent.click(getByText(buttonString));
    userEvent.click(getByText(buttonFunctionString));

    expect(queryByText(expectedModelName)).toBeNull();
  });
});
