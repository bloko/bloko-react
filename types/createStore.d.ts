import { BlokoUnit } from './create';

type AllowedValues = string | number | boolean | null | undefined;

interface StateObject {
  type: BlokoUnit
  setter?: boolean
}

export interface CreateStoreDescriptor {
  key: string,
  state: { [key: string]: BlokoUnit | StateObject },
  actions: {
    [key: string]: {
      repository: (payload: object) => object
      resolved: (payload: object, state: object) => object
    }
  }
}

export interface BlokoStore {
  state: {
    [key: string]: {
      [key: string]: AllowedValues,
    },
  },
  actions: {
    [key: string]: (payload?: object) => void | never
  },
}
