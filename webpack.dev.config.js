const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/main/webapp/index.html',
  filename: 'index.html',
  inject: 'body'
});

process.env.NODE_ENV = 'development';

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./src/main/webapp/index.js",
  devServer: {
    inline: true,
    port: 3333
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'react-hmre'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      }
    ]
  },
  output: {
    path: __dirname + "/dist/",
    filename: "bundle.min.js"
  },
  plugins: [
    HtmlWebpackPluginConfig
  ],
};