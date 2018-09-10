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
  const oldValueObj = ramda.view(lens, obj);
  return ramda.set(lens, Object.assign({}, oldValueObj, valueObj), obj);
};

/*
 * Verneint den Wert entlang des Pfades
 */
export const togglePath = (path, obj) => {
  const lens = ramda.lensPath(path);
  const oldValue = ramda.view(lens, obj);
  return ramda.set(lens, !oldValue, obj);
};

/*
 * Liest den Wert entland des Pfades
 */
export const viewPath = (path, obj) => {
  const lens = ramda.lensPath(path);
  return ramda.view(lens, obj);
};

/*
 * Gibt sofern vorhanden das Property vom Object zurück
 */
export const view = (prop, obj) => ramda.prop(prop, obj);

/*
 * Durchsucht ein Array nach einem Element mit einem bestimmten Property
 */
export const findBy = (prop, data, id) => {
  if (!data) {
    return undefined;
  }
  return ramda.find(ramda.propEq(prop, id))(data);
};

/*
 * Durchsucht ein Array nach einem Element mit einer bestimmten ID
 */
export const findById = (data, id) => findBy('id', data, id);

/*
 * Vergleicht zwei Strukturen auf Gleichheit
 */
export const deepEqual = (obj1, obj2) => ramda.equals(obj1, obj2);