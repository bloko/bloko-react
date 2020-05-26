import noop from './noop';

let tip = noop;

/* istanbul ignore else */
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  tip = message => console.warn(`[Bloko tip]: ${message}`);
}

export default tip;
