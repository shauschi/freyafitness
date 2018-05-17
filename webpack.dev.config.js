const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const path = require('path');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: '!!html-loader!./src/main/webapp/index.html',
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
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      'react-native': 'react-native-web',
    },
    plugins: [
      new ModuleScopePlugin(__dirname + '/src/'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015', 'react-hmre'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
        }
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader:"file-loader",
        query:{
          name:'[name].[ext]',
          outputPath:'images/'
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader",
        query:{
          limit:'10000',
          name:'[name].[ext]',
          outputPath:'fonts/'
        }
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
    ]
  },
  output: {
    path: __dirname + "/dist/",
    filename: "bundle.min.js"
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new webpack.DefinePlugin({
      __API__: "'http://127.0.0.1:9000'"
    })
  ],
};