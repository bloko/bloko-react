import { useState } from 'react';

function useBloko(Bloko) {
  const [bloko, setBloko] = useState(Bloko);

  function update(updatedBloko) {
    // create a new shallow clone for React reactivity
    setBloko(shallowClone(updatedBloko));
  }

  return [bloko, update];
}

function shallowClone(obj) {
  var clone = Object.create(Object.getPrototypeOf(obj));

  var props = Object.getOwnPropertyNames(obj);

  props.forEach(key => {
    var desc = Object.getOwnPropertyDescriptor(obj, key);

    Object.defineProperty(clone, key, desc);
  });

  return clone;
}

export default useBloko;
