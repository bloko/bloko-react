import { BlokoUnit } from './create';
import * as React from 'react';

interface BlokoProviderProps {
  children: React.ReactNode;
  blokos: BlokoUnit[],
}

export type BlokoProvider = (props: BlokoProviderProps) => React.ReactNode;
