'use strict';

export const getCourses = (param) => {
  return new Promise((resolve, reject) => {
    if(param instanceof Error) {
      reject(param)
    } else {
      resolve({id: 4711, instructor: 'Freya'});
    }
  })
};
