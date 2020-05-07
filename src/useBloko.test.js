import React from 'react';
import { render } from '@testing-library/react';
import Bloko from '@bloko/js';
import useBloko from './useBloko';

describe('useBloko', () => {
  it('should initialize with default values', () => {
    const defaultNameValue = 'Name';

    const User = Bloko.create({
      name: defaultNameValue,
    });

    function Tree() {
      const [state] = useBloko(User);

      return (
        <React.Fragment>
          <div>{state.name}</div>
        </React.Fragment>
      );
    }

    const { getByText } = render(<Tree />);

    getByText(defaultNameValue);
  });

  it('should update value with one level path key', async () => {
    const defaultNameValue = 'Name';

    const User = Bloko.create({
      name: '',
    });

    function Tree() {
      const [user, setUser] = useBloko(User);

      React.useEffect(() => {
        setUser('name', defaultNameValue);
      }, []);

      return (
        <React.Fragment>
          <div>{user.name}</div>
        </React.Fragment>
      );
    }

    const { findByText } = render(<Tree />);

    const element = await findByText(defaultNameValue);

    expect(element).toBeInTheDocument();
  });

  it('should update value with multiple level path key', async () => {
    const defaultNameValue = 'Name';

    const Child = Bloko.create({
      name: '',
    });

    const User = Bloko.create({
      name: '',
      child: Child,
    });

    function Tree() {
      const [user, setUser] = useBloko(User);

      React.useEffect(() => {
        setUser('child.name', defaultNameValue);
      }, []);

      return (
        <React.Fragment>
          <div>{user.child.name}</div>
        </React.Fragment>
      );
    }

    const { findByText } = render(<Tree />);

    const element = await findByText(defaultNameValue);

    expect(element).toBeInTheDocument();
  });

  it('should update value with function payloads', async () => {
    const defaultNameValue = 'Name';

    const User = Bloko.create({
      name: defaultNameValue,
    });

    function Tree() {
      const [user, setUser] = useBloko(User);

      React.useEffect(() => {
        setUser('name', name => name + '!');
      }, []);

      return (
        <React.Fragment>
          <div>{user.name}</div>
        </React.Fragment>
      );
    }

    const { findByText } = render(<Tree />);

    const element = await findByText(defaultNameValue + '!');

    expect(element).toBeInTheDocument();
  });
});
