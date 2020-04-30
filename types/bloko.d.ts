import { HttpPromise } from './http';

interface RequestOptions {
  params?: object;
  query?: object;
  data?: object;
}

type AllowedTypes = object | string | number | null | undefined | symbol | boolean;
type SimpleActionCallback = (state: AllowedTypes) => AllowedTypes;
type SimpleActionPayload = AllowedTypes | SimpleActionCallback;

export type BlokoSimpleAction = (payload?: SimpleActionPayload) => void;

export type BlokoAction = (payload?: object, requestOptions?: RequestOptions) => Promise<HttpPromise>;

export type BlokoState = { [key: string]: object };
export type BlokoActions = { [key: string]: BlokoAction | BlokoSimpleAction };

export interface Bloko {
  state: BlokoState;
  actions: BlokoActions;
}

export class BlokoClass {
  static initialState?(): object;
}
