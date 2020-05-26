import isObject from './isObject';
import warn from './warn';

function recursiveUpdate(props, obj) {
  const sanitizeProps = createSanitizer(obj);
  const propNames = Object.keys(props).filter(sanitizeProps);

  for (let i = 0; i < propNames.length; i += 1) {
    const key = propNames[i];
    const value = props[key];

    if (isObject(value)) {
      recursiveUpdate(value, obj[key]);
    } else {
      obj[key] = value;
    }
  }
}

function createSanitizer(obj) {
  return key => {
    const hasKey = Object.prototype.hasOwnProperty.call(obj, key);

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && !hasKey) {
      warn(`Cannot found prop ${key} to be updated.`);
    }

    return hasKey;
  };
}

export default recursiveUpdate;
