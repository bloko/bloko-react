type AllowedValues = string | number | boolean | null | undefined;
type ValueFunction = (value: AllowedValues) => AllowedValues;
type DerivatedFunction = () => AllowedValues;
type RuleFunction = (value: AllowedValues) => boolean | string;

interface CreateObject {
  value: AllowedValues | ValueFunction
  rules: RuleFunction | RuleFunction[]
}

export type BlokoUnit = (payload?: object) => object;

export interface CreateDescriptor {
  [key: string]: string | DerivatedFunction | CreateObject | BlokoUnit,
}
