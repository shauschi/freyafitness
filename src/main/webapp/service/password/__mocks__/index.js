'use strict';

// has to be the original name not any alias
export const changePassword = (param) => {
  return new Promise((resolve, reject) => {
    if(param instanceof Error) {
      reject(param)
    } else {
      resolve({message: 'success'});
    }
  })
};
