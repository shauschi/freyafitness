const baseURL = 'http://127.0.0.1:8080';

export const getProfile = id => {
  return fetch(`${baseURL}/profile/${id}`)
    .then(response => {
      if (!response.ok)
        throw new Error('Response not ok');
      return response.json()
    });
};
