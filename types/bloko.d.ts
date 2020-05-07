import { BlokoUnit, CreateDescriptor } from './create';
import { BlokoStore, CreateStoreDescriptor } from './createStore';

export interface Bloko {
  create(descriptor: CreateDescriptor): BlokoUnit
  createStore(descriptor: CreateStoreDescriptor): BlokoStore
}

export const Bloko: Bloko;
