'use strict';

export const getCourseTypes = (param) => {
  return new Promise((resolve, reject) => {
    if(param instanceof Error) {
      reject(param)
    } else {
      resolve([{id: 4711, name: 'Soft'}, {id: 815, name: 'Normal'}]);
    }
  })
};
