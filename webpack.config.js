var path = require('path');

module.exports = {
  context: __dirname,
  entry: "./lib/entry.js",
  output: {
    filename: "./lib/bundle.js"
  },
  devtool: 'source-maps',
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
