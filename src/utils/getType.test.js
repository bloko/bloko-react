import getType from './getType';

describe('getType', () => {
  cases('should return {type} for {type} values', [
    { type: 'number', input: 1 },
    { type: 'string', input: '' },
    { type: 'array', input: [] },
    { type: 'object', input: {} },
    { type: 'boolean', input: true },
    { type: 'null', input: null },
    { type: 'undefined', input: undefined },
    { type: 'function', input: () => {} },
    { type: 'bigint', input: BigInt(1) },
    { type: 'symbol', input: Symbol('') },
  ]);
});

function cases(name, casesArray) {
  casesArray.forEach(item => {
    let _name = name.replace(/{type}/g, item.type);

    it(_name, () => {
      expect(getType(item.input)).toEqual(item.type);
    });
  });
}
