import noop from './noop';

let warn = noop;

/* istanbul ignore else */
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  warn = message => console.error(`[Bloko warn]: ${message}`);
}

export default warn;
