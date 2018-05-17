require('jsdom-global/register');

const {Response, Headers, Request} = require('whatwg-fetch');

global.Response = Response;
global.Headers = Headers;
global.Request = Request;

global.fetch = require('jest-fetch-mock');
global.__API__ = 'backend';
