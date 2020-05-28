import { useState, useCallback } from 'react';
import { merge } from '@bloko/js';
import isFunction from './utils/isFunction';
import isObject from './utils/isObject';

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
    setBloko(prev => {
      let nextState = null;

      if (payload) {
        // create a new copy to React reactivity
        nextState = Object.assign({}, prev || instance());

        const _payload = evaluate(payload, nextState);

        merge(nextState, _payload);
      }

      return nextState;
    });
  }

  // Necessary to safely use inside useEffects
  const _update = useCallback(update, []);

  return [bloko, _update];
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
