const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyPlugin = require('uglifyjs-webpack-plugin');

const config = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(process.cwd(), './lib'),
  },
  module: {
    noParse: /node_modules/,
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              extends: path.resolve(__dirname, 'babel.json5'),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['./lib'], {
      root: process.cwd(),
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  devtool: 'cheap-source-map',
  target: 'web',
};

if (process.env.NODE_ENV === 'production') {
  config.devtool = 'source-map';
  config.plugins.push(
    new UglifyPlugin({
      parallel: true,
      sourceMap: true,
    }),
  );
}

module.exports = config;
