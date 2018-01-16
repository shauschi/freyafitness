'use strict';

export const GET = url => fetch(url)
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
      'Content-Type': 'application/json'
    }
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
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok)
      throw new Error('Response not ok');
    return response.json();
  });