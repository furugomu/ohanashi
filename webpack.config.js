'use strict';

const path = require('path');
const webpack = require('webpack');

const env = process.env.NODE_ENV || 'development';

let config = module.exports = {
  entry: './js/ohanashi.js',
  output: {
    filename: 'build.js',
    path: '.',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [path.join(__dirname, './js')],
        loader: 'babel-loader',
      },
    ],
  },
}

if (env === 'development') {
  config.devtool = '#eval';
}

if (env === 'production') {
  config.plugins = [
    new webpack.optimize.UglifyJsPlugin(),
  ];
}
