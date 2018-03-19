'use strict';
process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: '!!html-loader!./src/main/webapp/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  context: __dirname,
  devtool: 'eval',
  entry: './src/main/webapp/index.js',
  plugins: [
    new CleanWebpackPlugin([__dirname + '/src/main/resources/static/']),
    new UglifyJSPlugin(),
    HtmlWebpackPluginConfig,
    new webpack.DefinePlugin({
      __API__: "'http://127.0.0.1:9000'"
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      }
    ]
  },
  output: {
    path: __dirname + '/src/main/resources/static/',
    filename: 'bundle.min.js'
  }
};