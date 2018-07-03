require('jsdom-global/register');

const {Response, Headers, Request} = require('whatwg-fetch');

global.Response = Response;
global.Headers = Headers;
global.Request = Request;

global.fetch = require('jest-fetch-mock');
global.__API__ = 'backend';

global.RESET_PASSWORD = false;
global.RESET_PASSWORD_TOKEN = undefined;
global.ERROR_MESSAGE = undefined;