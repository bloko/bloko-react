import React from 'react';
import { render } from '@testing-library/react';
import Bloko from '@bloko/js';
import useBloko from './useBloko';

describe('useBloko', () => {
  it('should initialize with default values', () => {
    const defaultNameValue = 'Name';
    const defaultLastNameValue = 'LastName';

    const User = Bloko.create({
      name: defaultNameValue,
      lastName: defaultLastNameValue,
    });

    function Tree() {
      const [state] = useBloko(User);

      return (
        <React.Fragment>
          <div>{state.name}</div>
          <div>{state.lastName}</div>
        </React.Fragment>
      );
    }

    const { getByText } = render(<Tree />);

    getByText(defaultNameValue);
    getByText(defaultLastNameValue);
  });

  it('should update bloko using partial state', async () => {
    const defaultNameValue = 'Name';
    const defaultLastNameValue = 'LastName';

    const User = Bloko.create({
      name: '',
      lastName: defaultLastNameValue,
    });

    function Tree() {
      const [user, setUser] = useBloko(User);

      React.useEffect(() => {
        setUser({ name: defaultNameValue });
      }, []);

      return (
        <React.Fragment>
          <div>{user.name}</div>
          <div>{user.lastName}</div>
        </React.Fragment>
      );
    }

    const { findByText, getByText } = render(<Tree />);

    getByText(defaultLastNameValue);

    const element = await findByText(defaultNameValue);

    getByText(defaultLastNameValue);
    expect(element).toBeInTheDocument();
  });

  it('should update children blokos with partial state', async () => {
    const defaultNameValue = 'Name';
    const defaultUserNameValue = 'UserName';

    const Child = Bloko.create({
      name: '',
    });

    const User = Bloko.create({
      name: defaultUserNameValue,
      child: Child,
    });

    function Tree() {
      const [user, setUser] = useBloko(User);

      React.useEffect(() => {
        setUser({ child: { name: defaultNameValue } });
      }, []);

      return (
        <React.Fragment>
          <div>{user.name}</div>
          <div>{user.child.name}</div>
        </React.Fragment>
      );
    }

    const { findByText, getByText } = render(<Tree />);

    getByText(defaultUserNameValue);

    const element = await findByText(defaultNameValue);

    getByText(defaultUserNameValue);
    expect(element).toBeInTheDocument();
  });

  it('should update blokos with function', async () => {
    const defaultNameValue = 'Name';
    const defaultUserNameValue = 'UserName';

    const Child = Bloko.create({
      name: defaultNameValue,
    });

    const User = Bloko.create({
      name: defaultUserNameValue,
      child: Child,
    });

    function Tree() {
      const [user, setUser] = useBloko(User);

      React.useEffect(() => {
        setUser(prev => ({ child: { name: prev.child.name + '!', test: 1 } }));
      }, []);

      return (
        <React.Fragment>
          <div>{user.name}</div>
          <div>{user.child.name}</div>
        </React.Fragment>
      );
    }

    const { findByText, getByText } = render(<Tree />);

    getByText(defaultUserNameValue);

    const element = await findByText(defaultNameValue + '!');

    getByText(defaultUserNameValue);
    expect(element).toBeInTheDocument();
  });
});
