'use strict';
import {GET} from '../HttpUtils';
const baseURL = __API__;

export const getNews = () => GET(`${baseURL}/news/previews`);