import { BlokoUnit } from './create';

type AllowedValues = string | number | boolean | null | undefined;
export type BlokoUnitState = { [key: string]: AllowedValues };
export type BlokoUnitUpdate = (path: string, value: object) => void;

export function useBloko(bloko: BlokoUnit): [BlokoUnitState, BlokoUnitUpdate];
