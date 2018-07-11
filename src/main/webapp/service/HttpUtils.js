'use strict';
import cookie from 'react-cookies';
const baseURL = __API__;

const basicHeader = btoa('freyaFitnessWebApp:secret');

const acceptJsonHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

const securityHeaders = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*',
};

const getAccessTokenHeader = () => {
  const tokenData = cookie.load('tokenData');
  if (tokenData && tokenData['access_token']) {
    return {'Authorization': 'Bearer   ' + tokenData['access_token']};
  }
};

const toEncodedBody = (data) => Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');

const updateTokenData = data =>
  fetch(`${baseURL}/oauth/token`,
    {
      method: 'POST',
      headers: {
        ...securityHeaders,
        'Authorization': 'Basic ' + basicHeader,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: toEncodedBody(data)
    }
  ).then(response => {
    if (!response.ok) {
      throw new Error("Error fetching token");
    }
    return response.json()
      .then(tokenData => {
        cookie.save('tokenData', tokenData, {path: '/'});
        return new Promise(resolve => resolve(tokenData));
      });
  });

let updatingAccessToken = undefined;
const updateAccessToken = () => {
  // if multiple calls get a 401 and try to update the token data,
  // do not request a new token multiple times!
  // Therefore return the same promise at this point.
  if (updatingAccessToken) {
    return updatingAccessToken;
  }
  const tokenData = cookie.load('tokenData');
  if (tokenData && tokenData['refresh_token']) {
    updatingAccessToken = updateTokenData({
      refresh_token: tokenData['refresh_token'],
      grant_type: 'refresh_token'
    });
  } else {
    updatingAccessToken = new Promise((resolve, reject) => reject("No refresh token available"));
  }
  return updatingAccessToken.then(tokenData => {
    updatingAccessToken = undefined;
    return new Promise(resolve => resolve(tokenData))
  }).catch(error => {
    updatingAccessToken = undefined;
    console.info("Could not refresh the oauth token => delete cookie");
    cookie.remove('tokenData', {path: '/'});
    return new Promise((resolve, reject) => reject(error))
  });
};

const fetchWithToken = (url, params, retry = true) =>
  fetch(url, params)
    .then(async response => {
      // 401 indicates that the access token is expired
      if (response.status === 401 && retry && !!cookie.load('tokenData')) {
        return updateAccessToken()
          .then(() => {
            // update headers with new token
            params.headers = {
              ...params.headers,
              ...getAccessTokenHeader()
            };
            return fetchWithToken(url, params, false);
          })
          .catch(e => {
            console.error("error while fetching token => retry once", e);
            params.headers.Authorization = null;
            return fetchWithToken(url, params, false);
          });
      }
      if (!response.ok) {
        let errorMessage = 'Oops, something went wrong';
        await response.json()
          .then(error => errorMessage = error.message);
        console.warn("Error message", errorMessage);
        throw new Error(errorMessage);
      }
      return new Promise(resolve => resolve(response));
    });

export const LOGIN = (loginData = {}) =>
  updateTokenData({
    username: loginData.email,
    password: loginData.password,
    grant_type: 'password'
  });

export const GET = url => fetchWithToken(url,
  {
    headers: {
      ...securityHeaders,
      ...getAccessTokenHeader()
    },
    credentials: 'include'
  })
  .then(response => response.json());

export const PUT = (url, data) => fetchWithToken(url,
  {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      ...acceptJsonHeaders,
      ...securityHeaders,
      ...getAccessTokenHeader()
    },
    credentials: 'include'
  })
  .then(response => response.json());

export const POST = (url, data) => fetchWithToken(url,
  {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      ...acceptJsonHeaders,
      ...securityHeaders,
      ...getAccessTokenHeader()
    },
    credentials: 'include'
  })
  .then(response => response.json());

export const GET_IMAGE = url => fetchWithToken(url,
  {
    method: 'GET',
    headers: {
      ...securityHeaders,
      ...getAccessTokenHeader()
    },
    credentials: 'include'
  })
  .then(response => response.blob());

export const POST_IMAGE = (url, data) => fetchWithToken(url,
  {
    method: 'POST',
    body: data,
    headers: {
      ...securityHeaders,
      ...getAccessTokenHeader()
    },
    credentials: 'include'
  })
  .then(response => response.json());