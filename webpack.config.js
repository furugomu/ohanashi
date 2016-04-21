'use strict';

const path = require('path');

module.exports = {
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
