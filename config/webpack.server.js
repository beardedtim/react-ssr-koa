const path =require("path")
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // installed via npm
const LoadablePlugin = require('@loadable/webpack-plugin')

const config  = {
  entry: path.resolve(__dirname, '..', 'src', "start.ts"),
  mode: process.env.NODE_ENV === "development" ? "development" : "production",
  target: "node",
  devtool: "source-map",
  node: {
    __dirname: false,
    __filename: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new LoadablePlugin()
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "start.js",
    path: path.resolve(__dirname, '..', "dist", 'server')
  },
  externals: [nodeExternals()]
};

module.exports = config