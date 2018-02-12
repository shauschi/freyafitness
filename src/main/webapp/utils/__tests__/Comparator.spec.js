import {comparing, comparingMod, ASC, DESC} from './../Comparator.jsx';

describe('courses reducer', () => {

  const obj1 = {
    index: 1,
    name: 'testee',
    value: 100
  };

  const obj2 = {
    index: 2,
    name: 'foo bar',
    value: -500
  };

  describe('test comparing', () => {
    it('should return the expected value', () => {
      expect(comparing('index')(obj1, obj2)).toEqual(-1);
      expect(comparing('index')(obj1, obj1)).toEqual(0);
      expect(comparing('index')(obj2, obj1)).toEqual(1);

      expect(comparing('name')(obj1, obj2)).toEqual(1);
      expect(comparing('name')(obj1, obj1)).toEqual(0);
      expect(comparing('name')(obj2, obj1)).toEqual(-1);
    });

    it('should return the expected value ASC', () => {
      expect(comparing('index', ASC)(obj1, obj2)).toEqual(-1);
      expect(comparing('index', ASC)(obj1, obj1)).toEqual(0);
      expect(comparing('index', ASC)(obj2, obj1)).toEqual(1);

      expect(comparing('name', ASC)(obj1, obj2)).toEqual(1);
      expect(comparing('name', ASC)(obj1, obj1)).toEqual(0);
      expect(comparing('name', ASC)(obj2, obj1)).toEqual(-1);
    });

    it('should return the expected value DESC', () => {
      expect(comparing('index', DESC)(obj1, obj2)).toEqual(1);
      expect(comparing('index', DESC)(obj1, obj1)).toEqual(0);
      expect(comparing('index', DESC)(obj2, obj1)).toEqual(-1);

      expect(comparing('name', DESC)(obj1, obj2)).toEqual(-1);
      expect(comparing('name', DESC)(obj1, obj1)).toEqual(0);
      expect(comparing('name', DESC)(obj2, obj1)).toEqual(1);
    });

    it('should throw an exception when sort is not ASC or DESC', () => {
      expect(() => comparing('index', 'foo')).toThrow('sort must be ASC or DESC');
      expect(() => comparing('index', 1)).toThrow('sort must be ASC or DESC');
    });
  });

  describe('test comparingMod', () => {
    it('should return the expected value', () => {
      expect(comparingMod('value', v => v)(obj1, obj2)).toEqual(1);
      expect(comparingMod('value', v => v)(obj1, obj1)).toEqual(0);
      expect(comparingMod('value', v => v)(obj2, obj1)).toEqual(-1);

      expect(comparingMod('value', v => -v)(obj1, obj2)).toEqual(-1);
      expect(comparingMod('value', v => -v)(obj1, obj1)).toEqual(0);
      expect(comparingMod('value', v => -v)(obj2, obj1)).toEqual(1);
    });
  });

  describe('test comparing to sort an array', () => {
    it('should return the expected value', () => {
      const values = [{value: 100}, {value: 300}, {value: 200}];
      let result = values.sort(comparing('value'));
      expect(result[0].value).toEqual(100);
      expect(result[1].value).toEqual(200);
      expect(result[2].value).toEqual(300);

      result = values.sort(comparing('value', ASC));
      expect(result[0].value).toEqual(100);
      expect(result[1].value).toEqual(200);
      expect(result[2].value).toEqual(300);

      result = values.sort(comparing('value', DESC));
      expect(result[0].value).toEqual(300);
      expect(result[1].value).toEqual(200);
      expect(result[2].value).toEqual(100);
    });
  });
});


