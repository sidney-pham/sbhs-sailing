const path = require('path');
const webpack = require('webpack');
const config = require('./server/config');

module.exports = {
  context: path.join(__dirname, 'client'),
  entry: './index.js',
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
      context: ['**', '!/', '!/images/**'],
      target: `http://localhost:${config.port}`
    }]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
    // TODO: Add production minification/uglification.
  ]
};
