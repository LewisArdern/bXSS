const config = require('../../../server/utilities/config');

describe('utilities.config', () => {
  beforeEach(() => {
    config.test = {
      a: 'example@gmail.com',
      b: 3.1415,
      c: [5, 4, 3, 2],
      d: { x: 'x', y: 0, z: {} },
      e: true,
      f: false,
      g: null
    };
  });

  describe('get', () => {
    it('should return top-level properties', () => {
      expect(config.get('test')).toMatchObject(config.test);
    });

    it('should return nested properties', () => {
      expect(config.get('test.b')).toBe(3.1415);
      expect(config.get('test.f')).toBe(false);
      expect(config.get('test.d.x')).toBe('x');
    });

    it('should return undefined for undefined properties', () => {
      expect(config.get('test.doesNotExist')).toBe(undefined);
      expect(config.get('test.d.doesNotExist')).toBe(undefined);
      expect(config.get('test.d.z.doesNotExist')).toBe(undefined);
    });

    it('should return undefined for non-object properties', () => {
      expect(config.get('test.e.w.a.b.c')).toBe(undefined);
    });
  });

  describe('isValid', () => {
    it('should validate the basic JS types', () => {
      expect(
        config.isValid({
          'test.a': 'string',
          'test.b': 'number',
          'test.c': 'array',
          'test.d': 'object',
          'test.e': 'boolean',
          'test.f': 'boolean',
          'test.g': 'null',
          'test.doesNotExist': 'null'
        })
      ).toBeTruthy();
      [
        ['test.a', 'number'],
        ['test.b', 'string'],
        ['test.c', 'object'],
        ['test.d', 'boolean']
      ].forEach(([key, types]) => {
        const spec = {};
        spec[key] = types;
        expect(config.isValid(spec)).toBeFalsy();
      });
    });

    it('should not confuse null/undefined with false', () => {
      expect(config.isValid({ 'test.f': 'null' })).toBeFalsy();
      expect(config.isValid({ 'test.g': 'null' })).toBeTruthy();
      expect(config.isValid({ 'test.doesNotExist': 'null' })).toBeTruthy();
    });

    it('should validate multiple type specs', () => {
      ['first', 2, null].forEach(val => {
        config.test.a = val;
        expect(config.isValid({ 'test.a': 'string|number|null' })).toBeTruthy();
      });
      config.test.a = false;
      expect(config.isValid({ 'test.a': 'string|number|null' })).toBeFalsy();
    });
  });
});
