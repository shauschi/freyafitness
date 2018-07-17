'use strict';

export const sendContact = (param) => {
  return new Promise((resolve, reject) => {
    if(param instanceof Error) {
      reject(param)
    } else {
      resolve({message: 'success'});
    }
  })
};
