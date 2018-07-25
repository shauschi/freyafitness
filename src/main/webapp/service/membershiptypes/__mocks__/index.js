'use strict';

export const getMembershipTypes = (param) => {
  return new Promise((resolve, reject) => {
    if(param instanceof Error) {
      reject(param)
    } else {
      resolve([{id: 4711, name: 'Trial'}, {id: 815, name: 'Abo'}]);
    }
  })
};
