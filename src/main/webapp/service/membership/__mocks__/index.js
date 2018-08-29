'use strict';

export const createMembership = (param) => {
  return new Promise((resolve, reject) => {
    if(param instanceof Error) {
      reject(param)
    } else {
      resolve({message: 'Membership created'});
    }
  })
};

export const fetchMemberships = (param) => {
  return new Promise((resolve, reject) => {
    if(param instanceof Error) {
      reject(param)
    } else {
      resolve([{id: '1'}, {id: '2'}]);
    }
  })
};