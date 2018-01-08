const path = require('path');
const webpack = require('webpack');
const config = require('./server/config');

module.exports = {
  context: path.join(__dirname, 'client'),
  // Who the hell knows why I have to do this but the docs say I have to.
  // All I wanted was for Babel to transpile from ES2017 to ES2015,
  // why do I have to install some inane polyfill and modify three files???
  entry: ['babel-polyfill', './index.js'],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5][emoji:3]',
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    hot: true,
    open: true,
    port: 3000,
    proxy: [{
      // Proxy everything except resources from /public to the server which
      // redirects to /.
      context: ['**', '!/login.html', '!/images/**', '!/scripts/**', '!/styles/**'],
      target: `http://localhost:${config.port}`
    }]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
    // TODO: Add production minification/uglification.
  ]
};
