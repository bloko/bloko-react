import React from 'react';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http } from '@bloko/js';
import { getStateText, getActionsText } from './test-utils/helpers';
import renderWithBloko from './test-utils/render';
import useBloko from './useBloko';

const MODEL_NAMES = { FOO: 'FooModel' };
const BLOKO_NAMES = { FOO: 'FooBloko' };
const actionName = 'myAction';
const method = 'get';
const endpoint = '/';
const repositoryMock = `${method.toUpperCase()} ${endpoint}`;
const successMock = jest.fn((context, data) => {
  context.commit(data);
});

class FooBloko {
  static initialState() {
    return {
      [MODEL_NAMES.FOO]: MODEL_NAMES.FOO,
    };
  }

  [actionName]() {
    return {
      repository: repositoryMock,
      success: successMock,
    };
  }
}

class FooModel {
  constructor(props) {
    this.name = props.name || '';
  }
}

const renderOptions = {
  models: { [MODEL_NAMES.FOO]: FooModel },
  blokos: { [BLOKO_NAMES.FOO]: FooBloko },
};

describe('useBloko', () => {
  it('should render correct interface for state and actions', () => {
    function Tree() {
      const [state, actions] = useBloko(BLOKO_NAMES.FOO);

      return (
        <React.Fragment>
          <div>{getStateText(state)}</div>
          <div>{getActionsText(actions)}</div>
        </React.Fragment>
      );
    }

    const { getByText } = renderWithBloko(<Tree />, renderOptions);

    const isLoadingActionName =
      'isLoading' + actionName.charAt(0).toUpperCase() + actionName.slice(1);

    const stateExpected = {
      [MODEL_NAMES.FOO]: {
        name: '',
      },
      [isLoadingActionName]: false,
    };

    const setModelName =
      'set' +
      MODEL_NAMES.FOO.charAt(0).toUpperCase() +
      MODEL_NAMES.FOO.slice(1);

    const dispatchExpected = {
      [setModelName]: jest.fn(),
      [actionName]: jest.fn(),
    };

    getByText(getStateText(stateExpected));
    getByText(getActionsText(dispatchExpected));
  });

  it('should update state with set actions', async () => {
    const expectedModelName = 'expectedFooName';
    const setModelName =
      'set' +
      MODEL_NAMES.FOO.charAt(0).toUpperCase() +
      MODEL_NAMES.FOO.slice(1);
    const buttonText = 'Submit';

    function Tree() {
      const [state, actions] = useBloko(BLOKO_NAMES.FOO);

      function onClick() {
        // updating FooModel.name
        actions[setModelName]({ name: expectedModelName });
      }

      return (
        <React.Fragment>
          <span>{state[MODEL_NAMES.FOO].name}</span>
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
    const setModelName =
      'set' +
      MODEL_NAMES.FOO.charAt(0).toUpperCase() +
      MODEL_NAMES.FOO.slice(1);
    const buttonText = 'Submit';

    function Tree() {
      const [state, actions] = useBloko(BLOKO_NAMES.FOO);

      function onClick() {
        // updating FooModel.name
        actions[setModelName](() => ({ name: expectedModelName }));
      }

      return (
        <React.Fragment>
          <span>{state[MODEL_NAMES.FOO].name}</span>
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
    const expectedModelName = 'expectedFooName';
    const buttonText = 'Submit';
    const isLoadingActionName =
      'isLoading' + actionName.charAt(0).toUpperCase() + actionName.slice(1);

    const instanceMock = http.instance();

    instanceMock[method].mockResolvedValue({
      [MODEL_NAMES.FOO]: { name: expectedModelName },
    });

    function Tree() {
      const [state, actions] = useBloko(BLOKO_NAMES.FOO);

      function onClick() {
        // updating FooModel.name
        actions[actionName]();
      }

      return (
        <React.Fragment>
          {state[isLoadingActionName] ? (
            <span>Carregando...</span>
          ) : (
            <span>{state[MODEL_NAMES.FOO].name}</span>
          )}
          <button onClick={onClick}>{buttonText}</button>
        </React.Fragment>
      );
    }

    const { getByText, findByText } = renderWithBloko(<Tree />, renderOptions);

    await act(async () => {
      await userEvent.click(getByText(buttonText));

      const element = await findByText(expectedModelName);

      expect(element).toBeInTheDocument();
      expect(instanceMock[method]).toHaveBeenCalledTimes(1);
      expect(instanceMock[method]).toHaveBeenCalledWith(endpoint);
    });
  });

  it('should not update state when has mismatch types', async () => {
    const expectedModelName = 'expectedFooName';
    const setModelName =
      'set' +
      MODEL_NAMES.FOO.charAt(0).toUpperCase() +
      MODEL_NAMES.FOO.slice(1);
    const buttonUndefined = 'SubmitUndefined';
    const buttonString = 'SubmitString';
    const buttonFunctionString = 'SubmitFunctionString';

    function Tree() {
      const [state, actions] = useBloko(BLOKO_NAMES.FOO);

      function onClickUndefined() {
        // trying to update partial object state with undefined value
        actions[setModelName]();
      }

      function onClickString() {
        // trying to update partial object state with primitive string
        actions[setModelName](expectedModelName);
      }

      function onClickFunctionString() {
        // trying to update partial object state with function
        // which resolves to primitive string
        actions[setModelName](() => expectedModelName);
      }

      return (
        <React.Fragment>
          <span>{state[MODEL_NAMES.FOO].name}</span>
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

// const BLOKO_NAMES = {
//   FOO: 'FooBloko',
//   BAR: 'BarBloko',
//   BAZ: 'BazBloko',
// };

// const MODEL_NAMES = {
//   FOO: 'FooModel',
//   BAR: 'BarModel',
//   BAZ: 'BazModel',
// };

// class FooBloko {}
// class BarBloko {}
// class BazBloko {}

// class FooModel {}
// class BarModel {}
// class BazModel {}

// const models = {
//   [MODEL_NAMES.FOO]: FooModel,
//   [MODEL_NAMES.BAR]: BarModel,
//   [MODEL_NAMES.BAZ]: BazModel,
// };

// const blokos = {
//   [BLOKO_NAMES.FOO]: FooBloko,
//   [BLOKO_NAMES.BAR]: BarBloko,
//   [BLOKO_NAMES.BAZ]: BazBloko,
// };
