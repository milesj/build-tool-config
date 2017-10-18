/* eslint-disable no-magic-numbers */

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyPlugin = require('uglifyjs-webpack-plugin');
const options = require('yargs-parser')(process.argv.slice(2));

/*
 * Webpack requires the inputs and output passed as CLI arguments,
 * so make sure they are passed instead of configured here.
 */
const inputs = [...options._];
const output = inputs.pop();

if (inputs.length === 0 || !output) {
  throw new Error('Webpack input and output arguments required.');
}

const config = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
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
    new webpack.EnvironmentPlugin(['NODE_ENV']),
  ],
  devtool: 'cheap-source-map',
  target: 'web',
};

if (options.clean) {
  config.plugins.push(
    new CleanWebpackPlugin([path.dirname(output)], {
      root: process.cwd(),
    }),
  );
}

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
