var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    popup: './app/scripts/ext/popup.js',
    options: './app/scripts/ext/options.js',
    background: './app/scripts/ext/background.js',
  },
  output: {
    path: './app/scripts',
    filename: '[name].js'
  },
  module: {
    loaders: [
      { 
        test: /\.js$/, 
        loaders: ['babel'] 
      },
      {
        test: /\.scss$/, 
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap!toolbox')
      },
      { 
        test: /\.json$/, 
        loader: 'json-loader' 
      },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json', '.jsx', '.scss'] 
  },
  toolbox: {
    theme: path.join(__dirname, './app/styles/toolbox-theme.scss')
  },
  plugins: [
    new ExtractTextPlugin('../styles/style.css', { 
      allChunks: true 
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
  ],
};