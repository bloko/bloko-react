import { useState } from 'react';
import isFunction from './utils/isFunction';

function useBloko(Bloko) {
  const [bloko, setBloko] = useState(() => Bloko());

  function update(path, value) {
    const splits = path.split('.');
    let refKey = splits.pop();
    let ref = bloko;

    for (let i = 0; i < splits.length; i += 1) {
      const split = splits[i];

      ref = ref[split];
    }

    let _value = value;

    if (isFunction(value)) {
      _value = value(ref[refKey]);
    }

    // Update bloko value
    ref[refKey] = _value;

    // create a new copy to React reactivity
    setBloko(Object.assign({}, bloko));
  }

  return [bloko, update];
}

export default useBloko;
