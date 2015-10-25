var webpack = require("webpack");
var path = require("path");
var fs = require("fs");
var pkg = require("./package.json");

var NODE_ENV = process.env.NODE_ENV || "development";
var EXCLUDE = /(build|dist|global)/;


module.exports = {
  cache: true,
  devtool: "eval",
  entry: [
    "babel-core/polyfill",
    "./src/index"
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js",
    library: pkg.name,
    libraryTarget: "umd",
    //devtoolModuleFilenameTemplate: "[resource-path]",
    //sourceMapFilename: "[file].map"
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
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ["", ".js", ".jsx"],
    modulesDirectories: ["node_modules", "web_modules", "lib"]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, "src"),
        loader: "babel!flowcheck-loader!babel?blacklist=flow"
      }
    ]
  }
};
