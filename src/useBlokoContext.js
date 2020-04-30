import { useContext } from 'react';
import context from './utils/context';

function useBlokoContext() {
  return useContext(context);
}

export default useBlokoContext;
