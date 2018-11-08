'use strict';
import {POST} from '../HttpUtils';
const baseURL = __API__;

export const sendContact = contactForm => POST(`${baseURL}/contact`, contactForm);
