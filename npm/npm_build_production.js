'use strict';
const webpack = require('webpack');
webpack({
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  }
}, function(err, stats) {
  // console.log(stats);
  console.log(err);
});