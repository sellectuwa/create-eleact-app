const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const rootPath = path.resolve(__dirname);

module.exports = {
  entry: path.resolve(rootPath, 'src', 'index.js'),
  target: 'electron-renderer',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(css)$/,
        use: [
          process.env.NODE_ENV === 'development'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          process.env.NODE_ENV === 'development'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg|jpg|png)$/,
        type: 'asset/resource',
      },
    ],
  },
  devServer: {
    contentBase: path.join(rootPath, 'dist/renderer'),
    host: '0.0.0.0',
    port: 4000,
    publicPath: '/',
  },
  output: {
    path: path.resolve(rootPath, 'dist/renderer'),
    publicPath: './',
    filename: 'index.bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootPath, 'src/index.html'),
    }),
    new MiniCssExtractPlugin(),
  ],
};
