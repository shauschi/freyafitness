'use strict';

export const GET = url => fetch(url,
  {
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': 'http://127.0.0.1:3333'
    },
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok)
      throw new Error('Response not ok');
    return response.json();
  });

export const PUT = (url, data) => fetch(url,
  {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': 'http://127.0.0.1:3333'
    },
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok)
      throw new Error('Response not ok');
    return response.json();
  });

export const POST = (url, data) => fetch(url,
  {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': 'http://127.0.0.1:3333'
    },
    credentials: 'include'
  })
  .then(response => {
    if (!response.ok)
      throw new Error('Response not ok');
    return response.json();
  });

export const POST_IMAGE = (url, data) => fetch(url,
  {
    method: 'POST',
    body: data
  })
  .then(response => {
    if (!response.ok)
      console.warn(response); //throw new Error('Response not ok');
  });