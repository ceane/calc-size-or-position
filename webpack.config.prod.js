var webpack = require("webpack");
var path = require("path");
var fs = require("fs");
var pkg = require("./package.json");
var devConfig = require("./webpack.config.dev");
var legal = fs.readFileSync("./LICENSE", "utf8");

var NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
  cache: true,
  devtool: "source-map",
  entry: {
    common: [
      "babel-core/polyfill",
      "isomorphic-fetch",
      "react",
      "react-dom",
      "redux",
      "redux-undo",
      "react-redux",
      "core-decorators",
      "./src/index",
      "style.css"
    ],
    header: ["./src/header"],
    footer: ["./src/footer"],
    home: ["./src/home"],
    blog: ["./src/blog"],
    locator: ["./src/locator"],
    "no-flexbox.css": ["no-flexbox.css"]
  },
  output: {
    path: path.join(__dirname, "../js"),
    publicPath: "/wp-content/themes/" + pkg.name +"/js/",
    filename: "[name].js",
    //devtoolModuleFilenameTemplate: "[resource-path]",
    sourceMapFilename: "[file].map"
  },
  plugins: [
    new webpack.BannerPlugin(legal, { entryOnly: true }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
      __DEV__: JSON.stringify(NODE_ENV),
      GMAPS_API_KEY: JSON.stringify("AIzaSyDk_zewKbejvBzLKW8d1CTO476F9Tw2TSM"),
      __NAME__: JSON.stringify(pkg.name),
      __DESC__: JSON.stringify(pkg.description),
      __VERSION__: JSON.stringify(pkg.version)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ["common"],
      filename: "common.js",
      minChunks: Infinity
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin({
      minSizeReduce: 1.5,
      moveToParents: false
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      "screw-ie8": true,
      compress: {
        booleans: true,
        conditionals: true,
        dead_code: true,
        drop_console: true,
        loops: true,
        comparisons: true,
        warnings: false
      }
    }),
    //new OfflinePlugin({})
  ],
  resolve: devConfig.resolve,
  module: devConfig.module
};
