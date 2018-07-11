'use strict';
const _ = require("lodash");
const env = process.env.NODE_ENV || "development";
const debug = ["development", "test"].indexOf(env) !== -1;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: '!!html-loader!./src/main/webapp/index.html',
  filename: 'index.html',
  inject: 'body'
});

const defaults = {
  cache: debug,
  context: __dirname,
  devtool: debug ? "eval" : false,
  entry: './src/main/webapp/index.js',
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
      }
    ],
  },
  output: {
    path: __dirname + '/src/main/resources/static/',
    filename: 'bundle.min.js'
  },
  plugins: [
    new CleanWebpackPlugin([__dirname + '/src/main/resources/static/']),
    new CopyWebpackPlugin([
      {
        from: './src/main/webapp/*.+(png|jpg)',
        flatten: true
      }
    ]),
    new UglifyJSPlugin(),
    HtmlWebpackPluginConfig
  ],
  target: "web",
};

module.exports.defaults = defaults;

module.exports.extend = function merge(config) {
  return _.extend({}, defaults, config);
};

module.exports.merge = function merge(config) {
  return _.merge({}, defaults, config);
};