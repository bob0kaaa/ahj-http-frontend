const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',

  // Spin up a server for quick development
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, '/dist'),

    open: true,
    compress: true,
    port: 7071,
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
