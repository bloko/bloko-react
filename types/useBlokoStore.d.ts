import { BlokoStore } from './createStore';

type AllowedValues = string | number | boolean | null | undefined;
export type BlokoAction = (payload?: object) => void | never;
export type BlokoState = { [key: string]: { [key: string]: AllowedValues } };
export type BlokoActions = { [key: string]: BlokoAction };

export interface BlokoStoreHookResponse {
  state: BlokoState;
  actions: BlokoActions;
}

export function useBlokoStore(blokoStore: BlokoStore): BlokoStoreHookResponse;
