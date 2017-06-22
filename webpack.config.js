/* eslint strict: 0 */
'use strict'

var webpack = require('webpack')
var path = require('path')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  cache: true,
  devtool: 'source-map',
  devServer: {
    contentBase: 'build/client',
    historyApiFallback: true,
    hot: true,
    stats: 'errors-only',
  },
  entry: [
    'react-hot-loader/patch',
    'babel-polyfill',
    './client/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'build', 'client'),
    publicPath: '/',
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js(x)?$/,
        loader: 'eslint-loader'
      },
      {
        test: /\.js(x)?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        loader: 'url-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(s)?css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader',
            options: {
              camelCase: true,
              importLoaders: 1,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
              modules: true,
              sourceMap: true
            }
          }, {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.(s)?css$/,
        include: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader',
          }, {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.sol/,
        loaders: ['json-loader', 'truffle-solidity-loader?network=development']
      }
    ],
    noParse: /lie\.js|[\s\S]*.(svg|ttf|eot)/
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './client/index.html', to: 'index.html' }
    ]),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      '__DEV__': true,
      'process.env': {
        API_ENDPOINT: JSON.stringify('//localhost:8000'),
        NODE_ENV: JSON.stringify('development'),
        IPFS_HOST: JSON.stringify('testrpc'),
        IPFS_PORT: 5001
      }
    })
  ],
  stats: {
    children: false
  }
}
