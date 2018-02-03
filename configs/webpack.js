// --color

const path = require('path');
const webpack = require('webpack');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyPlugin = require('uglifyjs-webpack-plugin');

const config = {
  devtool: 'cheap-source-map',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [path.resolve(__dirname, 'babel.js')],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    // new CleanWebpackPlugin([path.dirname(output)], {
    //   root: process.cwd(),
    // }),
  ],
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
