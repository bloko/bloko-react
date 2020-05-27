import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      const [state] = useBloko({ type: User, initial: true });

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

  it('should initialize with null state', () => {
    const nullState = 'nullState';
    const nullStateExplicit = 'nullStateExplicit';

    const User = Bloko.create({
      name: '',
    });

    function Tree() {
      const [user] = useBloko(User);
      const [userExplicit] = useBloko({ type: User, initial: false });

      return (
        <React.Fragment>
          <div>{user || nullState}</div>
          <div>{userExplicit || nullStateExplicit}</div>
        </React.Fragment>
      );
    }

    const { getByText } = render(<Tree />);

    getByText(nullState);
    getByText(nullStateExplicit);
  });

  it('should update bloko using partial state', async () => {
    const defaultNameValue = 'Name';
    const defaultLastNameValue = 'LastName';

    const User = Bloko.create({
      name: '',
      lastName: defaultLastNameValue,
    });

    function Tree() {
      const [user, setUser] = useBloko({ type: User, initial: true });

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
      const [user, setUser] = useBloko({ type: User, initial: true });

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
      const [user, setUser] = useBloko({ type: User, initial: true });

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

  it('should allow null values', async () => {
    const emptyUser = 'EmptyUser';

    const User = Bloko.create({
      name: '',
    });

    function Tree() {
      const [user, setUser] = useBloko({ type: User, initial: true });

      React.useEffect(() => {
        setUser(null);
      }, []);

      return (
        <React.Fragment>
          <div>{user ? user.name : emptyUser}</div>
        </React.Fragment>
      );
    }

    const { findByText } = render(<Tree />);

    const element = await findByText(emptyUser);

    expect(element).toBeInTheDocument();
  });

  it('should handle null state to bloko state', async () => {
    const emptyUser = 'EmptyUser';
    const name = 'name';
    const lastName = 'lastName';
    const buttonLabel = 'buttonLabel';

    const User = Bloko.create({
      name: '',
      lastName,
    });

    function Tree() {
      const [user, setUser] = useBloko({ type: User, initial: true });

      React.useEffect(() => {
        setUser(null);
      }, []);

      function onClick() {
        setUser({ name });
      }

      return (
        <React.Fragment>
          <div>{user ? user.name : emptyUser}</div>
          <div>{user ? user.lastName : ''}</div>
          <button onClick={onClick}>{buttonLabel}</button>
        </React.Fragment>
      );
    }

    const { findByText, getByText } = render(<Tree />);

    const element = await findByText(emptyUser);

    expect(element).toBeInTheDocument();

    const button = getByText(buttonLabel);

    userEvent.click(button);

    const nameText = await findByText(name);
    const lastNameText = await findByText(lastName);

    expect(nameText).toBeInTheDocument();
    expect(lastNameText).toBeInTheDocument();
  });
});
