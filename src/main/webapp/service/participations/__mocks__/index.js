'use strict';

export const deleteParticipation = (param) => {
  return new Promise((resolve, reject) => {
    if(param instanceof Error) {
      reject(param)
    } else {
      resolve({message: 'gelöscht'});
    }
  })
};
