import path from "path";
import webpack from "webpack";
import ManifestPlugin from "webpack-manifest-plugin";
import cssnano from "cssnano";

import { IS_DEV, WEBPACK_PORT } from "./src/server/config";

const plugins = [new ManifestPlugin()];

const nodeModulesPath = path.resolve(__dirname, "node_modules");

const config: webpack.Configuration = {
  mode: IS_DEV ? "development" : "production",
  devtool: IS_DEV ? "inline-source-map" : false,
  entry: ["@babel/polyfill", "./src/client/client"],
  output: {
    path: path.join(__dirname, "dist", "statics"),
    filename: `[name]-[hash:8]-bundle.js`,
    publicPath: "/statics/",
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: ["babel-loader"],
        exclude: [/node_modules/, nodeModulesPath],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: IS_DEV ? "[name]__[local]" : "[hash:base64]",
              },
              sourceMap: IS_DEV,
            },
          },
        ],
      },
      {
        test: /.jpe?g$|.gif$|.png$|.svg$|.woff$|.woff2$|.ttf$|.eot$/,
        use: "url-loader?limit=10000",
      },
    ],
  },
  devServer: {
    port: WEBPACK_PORT,
    historyApiFallback: true,
  },
  plugins,
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};

export default config;
