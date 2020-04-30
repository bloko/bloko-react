// TODO: check these types with with an TypeScript expert
import * as React from 'react';
import { http } from './http';
import { Model } from './model';
import { Bloko, BlokoState, BlokoActions } from './bloko';

type useBloko = (namespace: string) => [BlokoState, BlokoActions];

export { Model, http, useBloko };

declare module '@bloko/react' {
  interface BlokoProviderProps {
    children: React.ReactNode;
    models: { [key: string]: Model };
    blokos: { [key: string]: Bloko };
  }

  function BlokoProvider(props: BlokoProviderProps) : React.ReactNode;

  export = { Model, Provider: BlokoProvider };
}
