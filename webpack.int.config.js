'use strict';
process.env.NODE_ENV = 'test';

const webpack = require('webpack');
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
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
    new CopyWebpackPlugin([
      {from: './src/main/webapp/test1000.jpg', to: __dirname + '/src/main/resources/static/'},
      {from: './src/main/webapp/test1001.jpg', to: __dirname + '/src/main/resources/static/'},
      {from: './src/main/webapp/about_freya.jpg', to: __dirname + '/src/main/resources/static/'},
      {from: './src/main/webapp/logo.png', to: __dirname + '/src/main/resources/static/'},
      {from: './src/main/webapp/welcome_md.jpg', to: __dirname + '/src/main/resources/static/'},
      {from: './src/main/webapp/welcome_xs.jpg', to: __dirname + '/src/main/resources/static/'}
    ]),
    new UglifyJSPlugin(),
    HtmlWebpackPluginConfig,
    new webpack.DefinePlugin({
      __API__: "'https://freya.fitness:9443'"
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
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
    ]
  },
  output: {
    path: __dirname + '/src/main/resources/static/',
    filename: 'bundle.min.js'
  }
};