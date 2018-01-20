'use strict';
import * as ramda from 'ramda';

/*
 * Setzt den Wert entlang eines Pfades auf 'value'
 */
export const setPath = (path, value, obj) => {
  const lens = ramda.lensPath(path);
  return ramda.set(lens, value, obj);
};

/*
 * Elaubt das verändern von mehreren Werten via Object.assign
 * entlang eines Pfades.
 *
 * Beispiel:
 * const original = {
 *   foo: {
 *     val1: 100,
 *     val2: 200,
 *     bar: {
 *       val1: 1000,
 *       val2: 2000
 *     }
 *   }
 * }
 * const result = assignPath(['foo', 'bar'], {val2: 'hello', val3: 'world'}, original);
 * => {
 *   foo: {
 *     val1: 100,
 *     val2: 200,
 *     bar: {
 *       val1: 1000,
 *       val2: 'hello',
 *       val3: 'world'
 *     }
 *   }
 * }
 */
export const assignPath = (path, valueObj, obj) => {
  const lens = ramda.lensPath(path);
  const oldValueObj = ramda.find(path, obj);
  return ramda.set(lens, Object.assign({}, oldValueObj, valueObj), obj);
};

/*
 * Verneint den Wert entlang des Pfades
 */
export const togglePath = (path, obj) => {
  const lens = ramda.lensPath(path);
  const oldValue = ramda.find(path, obj);
  return ramda.set(lens, !oldValue, obj);
}