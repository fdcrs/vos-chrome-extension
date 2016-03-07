var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = require('./webpack.config');
var buildDir = path.resolve('./build');

config.output = {
  path: buildDir,
  filename: '/scripts/[name].js',
};

config.plugins = [
  new CleanWebpackPlugin([buildDir, './dist']),
  new CopyWebpackPlugin([
    { from: './app/manifest.json' },
    { from: './app/popup.html' },
    { from: './app/options.html' },
    {
      from: './app/images',
      to: 'images',
    },
  ]),
  new ExtractTextPlugin('styles/style.css', { 
    allChunks: true 
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  })
];

module.exports = config;