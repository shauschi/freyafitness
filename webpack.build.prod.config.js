'use strict';
process.env.NODE_ENV = 'production';
const base = require('./webpack.build.base.js');
const webpack = require('webpack');

module.exports = base.merge({
  plugins: [
    new webpack.DefinePlugin({
      __API__: "'https://freya.fitness'"
    })
  ]
});
