const path = require("path")

const WebpackCleanPlugin = require("webpack-clean-plugin")
const { WebpackManifestPlugin } = require("webpack-manifest-plugin")

const { VueLoaderPlugin } = require("vue-loader")

module.exports = {
    entry: {
        main: "./src/index.js"
    },
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: "",
    },

    module: {
        rules: [
            { 
                test: /\.vue$/,
                loader: "vue-loader",
            }
        ]
    },

    plugins: [
        new VueLoaderPlugin(),
        new WebpackManifestPlugin(),
        new WebpackCleanPlugin({ root: path.join(__dirname, 'dist') }),
    ],

    mode: "development",
};
