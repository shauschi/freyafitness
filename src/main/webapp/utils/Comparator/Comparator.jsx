'use strict';

export const ASC = 'ASC'; // Aufsteigend
export const DESC = 'DESC'; // Absteigend

/**
 * Vergleicht zwei Objekte anhand eines Feldes.
 * @param field Feld
 * @param sort (optional) ASC für aufsteigende (default), sonst absteigende Sortierung
 */
export const comparing = (field, sort) => {
  return comparingMod(field, value => value, sort || ASC);
};

/**
 * Vergleicht zwei Objekte anhand eines Feldes,
 * wobei der Wert des Feldes noch manipuliert wird.
 * @param field Feld
 * @param modify Funktion, die einen Wert erwartet
 * @param sort (optional) ASC für aufsteigende (default), sonst absteigende Sortierung
 */
export const comparingMod = (field, modify, sort) => {
  sort = sort || ASC;
  if (sort !== ASC && sort !== DESC) {
    throw new Error('sort must be ASC or DESC');
  }

  return (object1 ,object2) => {
    const value1 = modify(object1[field]);
    const value2 = modify(object2[field]);
    if (value1 > value2) return sort === ASC ? 1 : -1;
    else if (value1 < value2) return sort === ASC ? -1 : 1;
    else return 0;
  }
};

/**
 * Vergleicht zwei Objekte anhand eines Feldes,
 * wobei der Wert des Feldes noch manipuliert wird.
 * @param func Funktion, die ein Feld zurück giebt
 * @param modify Funktion, die einen Wert erwartet
 * @param sort (optional) ASC für aufsteigende (default), sonst absteigende Sortierung
 */
export const comparingModFunc = (func, modify, sort) => {
  sort = sort || ASC;
  if (sort !== ASC && sort !== DESC) {
    throw new Error('sort must be ASC or DESC');
  }

  return (object1 ,object2) => {
    const value1 = modify(func(object1));
    const value2 = modify(func(object2));
    if (value1 > value2) return sort === ASC ? 1 : -1;
    else if (value1 < value2) return sort === ASC ? -1 : 1;
    else return 0;
  }
};