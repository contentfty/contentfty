const path = require("path");
const ROOT_DIR = path.resolve(__dirname, "../../");

module.exports = {
  entry: path.resolve(ROOT_DIR, "src/index.js"),
  output: {
    path: path.resolve(ROOT_DIR, "build/lib"),
    filename: "index.js",
    library: "",
    libraryTarget: "umd"
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(ROOT_DIR, "./src")
    },
    extensions: [".js"]
  }
};
