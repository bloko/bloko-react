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

  it('should update bloko using setters', async () => {
    const defaultNameValue = 'Name';

    const User = Bloko.create({
      name: '',
    });

    function Tree() {
      const [user, setUser] = useBloko(User);

      React.useEffect(() => {
        user.name = defaultNameValue;

        setUser(user);
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

  it('should update children blokos with setters', async () => {
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
        user.child.name = defaultNameValue;

        setUser(user);
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
});
