import { useState } from 'react';
import isFunction from './utils/isFunction';
import isObject from './utils/isObject';
import recursiveUpdate from './utils/recursiveUpdate';

function useBloko(Bloko) {
  const { instance, initial } = getConfig(Bloko);

  const [bloko, setBloko] = useState(() => {
    let initialValue = null;

    if (initial) {
      initialValue = instance();
    }

    return initialValue;
  });

  function update(payload) {
    let nextState = null;

    if (payload) {
      // create a new copy to React reactivity
      nextState = Object.assign({}, bloko || instance());

      const _payload = evaluate(payload, nextState);

      recursiveUpdate(_payload, nextState);
    }

    setBloko(nextState);
  }

  return [bloko, update];
}

function evaluate(value, state) {
  if (isFunction(value)) {
    return value(state);
  }

  return value;
}

function getConfig(bloko) {
  let config = {
    instance: bloko,
    initial: false,
  };

  if (isObject(bloko)) {
    config.instance = bloko.type;
    config.initial = bloko.initial;
  }

  return config;
}

export default useBloko;
