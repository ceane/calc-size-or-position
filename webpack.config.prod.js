var webpack = require("webpack");
var path = require("path");
var fs = require("fs");
var pkg = require("./package.json");
var devConfig = require("./webpack.config.dev");
var legal = fs.readFileSync("./LICENSE", "utf8");

var NODE_ENV = process.env.NODE_ENV || "production";

module.exports = {
  cache: true,
  devtool: "source-map",
  entry: devConfig.entry,
  output: devConfig.output,
  plugins: [
    new webpack.BannerPlugin(legal, { entryOnly: true }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
      __DEV__: JSON.stringify(NODE_ENV),
      __NAME__: JSON.stringify(pkg.name),
      __DESC__: JSON.stringify(pkg.description),
      __VERSION__: JSON.stringify(pkg.version)
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin({
      minSizeReduce: 1.5,
      moveToParents: false
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
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
