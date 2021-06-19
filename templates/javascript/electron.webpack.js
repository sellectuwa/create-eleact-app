const path = require('path');

const rootPath = path.resolve(__dirname);

module.exports = {
  resolve: {
    extensions: ['.jsx', '.js'],
  },
  devtool: 'source-map',
  entry: path.resolve(rootPath, 'electron', 'main.js'),
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  node: {
    __dirname: false,
  },
};
