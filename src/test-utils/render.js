import React from 'react';
import { render } from '@testing-library/react';
import BlokoProvider from '../BlokoProvider';

function renderWithBloko(Component, { blokos }) {
  return render(<BlokoProvider blokos={blokos}>{Component}</BlokoProvider>);
}

export default renderWithBloko;
