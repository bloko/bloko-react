import React from 'react';
import { render } from '@testing-library/react';
import BlokoProvider from '../BlokoProvider';

function renderWithBloko(Component, { models, blokos }) {
  return render(
    <BlokoProvider models={models} blokos={blokos}>
      {Component}
    </BlokoProvider>
  );
}

export default renderWithBloko;
