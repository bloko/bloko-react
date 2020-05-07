import Bloko, { http } from '@bloko/js';
import BlokoProvider from './BlokoProvider';
import useBloko from './useBloko';
import useBlokoStore from './useBlokoStore';

export default {
  create: Bloko.create,
  createStore: Bloko.createStore,
  Provider: BlokoProvider,
};

export { http, useBloko, useBlokoStore };
