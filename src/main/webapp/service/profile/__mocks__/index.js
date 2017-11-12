export const getProfile = (param) => {
  return new Promise((resolve, reject) => {
    if(param instanceof Error) {
      reject(param)
    } else {
      resolve({firstname: 'Testee', lastname: 'Foobar'});
    }
  })
}
