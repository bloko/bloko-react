import { Bloko } from './bloko';
import { BlokoProvider } from './blokoProvider'

export interface BlokoReact extends Bloko {
  Provider: BlokoProvider;
}

export const BlokoReact: BlokoReact;
