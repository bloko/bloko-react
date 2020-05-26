import { useState } from 'react';
import isFunction from './utils/isFunction';
import recursiveUpdate from './utils/recursiveUpdate';

function useBloko(Bloko) {
  const [bloko, setBloko] = useState(Bloko);

  function update(payload) {
    // create a new copy to React reactivity
    const copy = Object.assign({}, bloko);
    const _payload = evaluate(payload, copy);

    recursiveUpdate(_payload, copy);

    setBloko(copy);
  }

  return [bloko, update];
}

function evaluate(value, state) {
  if (isFunction(value)) {
    return value(state);
  }

  return value;
}

export default useBloko;
