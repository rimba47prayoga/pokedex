const isLocal = process.env.NODE_ENV === "development";

module.exports = {
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    }
  },
  devServer: {
    disableHostCheck: true,
    port: 3000,
    hot: isLocal,
    liveReload: isLocal,
    inline: isLocal,
    watchOptions: {
      poll: false,
      ignored: /node_modules/
    }
  }
};
