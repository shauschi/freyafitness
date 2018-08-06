'use strict';

export const getStatistics = (param) => {
  return new Promise((resolve, reject) => {
    if(param instanceof Error) {
      reject(param)
    } else {
      resolve({userId: '1234'});
    }
  })
};
