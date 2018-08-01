'use strict';

export const updatePreference = (param) => {
  return new Promise((resolve, reject) => {
    if(param instanceof Error) {
      reject(param)
    } else {
      resolve({message: 'Preference saved'});
    }
  })
};
