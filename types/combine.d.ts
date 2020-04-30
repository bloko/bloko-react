import { Model } from './model';
import { BlokoClass } from './bloko';

export interface Combine {
  models: { [key: string]: Model };
  blokos: { [key: string]: BlokoClass };
}
