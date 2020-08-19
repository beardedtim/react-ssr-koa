const path = require("path")
const env = require('getenv')
const HtmlPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')
const webpack = require('webpack')

// All usage of S3 assets
// EX: ASSET_PATH=http://assets.url.com yarn build:client
// this will set the asset path to the URL above so that
// you can host the assets on some static server/s3 bucket
// while still having the SSR stuff working locally
//
const ASSET_PATH = env.string('ASSET_PATH', '/')

const config  = {
  entry: {
    // What stuff needs to be added to _every_ page and can be
    // split away from the client bundle
    vendor: ['react', 'react-dom', '@emotion/styled', '@emotion/core', '@material-ui/core'],
    main: path.resolve(__dirname, '..', 'src', "client/entry.tsx")
  },
  mode: process.env.NODE_ENV === "development" ? "development" : "production",
  target: "web",
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
    // Allows us to see the progress of our build
    new webpack.ProgressPlugin(),
    // Builds an HTML page that has the correct scripts/styles injected
    new HtmlPlugin({
      template: path.resolve(__dirname, 'template.html'),
      scriptLoading: 'defer',
      filename: path.resolve(__dirname, '..', 'dist', 'client', 'index.html')
    }),
    // Cleans up past webpack build files
    new CleanWebpackPlugin({
      verbose: true,
    }),
    // Syncs the changes in our browser
    new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        // Proxy === the SSR server
        proxy: 'http://localhost:5000/',
        injectCss: true
      }),
    new LoadablePlugin()
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, '..', "dist", 'client', 'static'),
    publicPath: ASSET_PATH,
  },
};

module.exports = config