var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require("path");
var fs = require("fs");
var pkg = require("./package.json");
//var ftpDeployPlugin = require("ftp-deploy-plugin")

var NODE_ENV = process.env.NODE_ENV || "development";
var EXCLUDE = /(build|dist|global)/;


module.exports = {
  cache: true,
  devtool: "eval",
  entry: [
    "eventsource-polyfill",
    "webpack-hot-middleware/client?overlay=true&reload=true",
    "babel-core/polyfill",
    "isomorphic-fetch",
    "react",
    "react-dom",
    "./src/index",
    "style.css"
  ],
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js",
    //devtoolModuleFilenameTemplate: "[resource-path]",
    sourceMapFilename: "[file].map"
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.CommonsChunkPlugin({
    //   names: ["common"],
    //   filename: "common.js",
    //   minChunks: Infinity
    // }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
      __DEV__: JSON.stringify(NODE_ENV),
      __NAME__: JSON.stringify(pkg.name),
      __TITLE__: JSON.stringify(pkg.author),
      __DESC__: JSON.stringify(pkg.description),
      __VERSION__: JSON.stringify(pkg.version)
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({ 
      hash: true,
      template: "src/index.html"
    }),
    new ExtractTextPlugin("[contenthash].css", "[contenthash].css", {disable: false})
  ],
  resolve: {
    root: [
      path.join(__dirname),
      path.join(__dirname, "../__styles"),
      path.join(__dirname, "../app/")
    ],
    extensions: ["", ".js", ".jsx", ".css"],
    modulesDirectories: ["node_modules", "web_modules", "lib", "__styles", "global", "assets"]
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        exclude: EXCLUDE,
        loader: ExtractTextPlugin.extract(
          "style-loader", 
          'css-loader?modules&localIdentName=[hash:base64:4]&minimize!autoprefixer-loader?{browsers:["last 2 version", "> 20% in US"]}'
        )
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, "../__styles/global"),
        loader: 'style-loader!css-loader?modules&localIdentName=[local]!autoprefixer-loader?{browsers:{browsers:["last 2 version", "> 20% in US"]}'
      },
      { test: /\.(png|svg)$/, loader: require.resolve("url-loader") + "?limit=17000" },
      { test: /\.jpg$/, loader: require.resolve("file-loader") },
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, "src"),
        loader: "babel!flowcheck-loader!babel?blacklist=flow"
      }
    ]
  }
};
