'use strict';

/**
 * Vergleicht zwei Objekte anhand eines Feldes.
 * @param field Feld
 */
export const comparing = field => {
  return comparingMod(field, value => value);
};

/**
 * Vergleicht zwei Objekte anhand eines Feldes,
 * wobei der Wert des Feldes noch manipuliert wird.
 * @param field Feld
 * @param modify Funktion, die einen Wert erwartet
 */
export const comparingMod = (field, modify) => {
  return (object1 ,object2) => {
    const value1 = modify(object1[field]);
    const value2 = modify(object2[field]);
    if (value1 > value2) return 1;
    else if (value1 < value2) return -1;
    else return 0;
  }
};