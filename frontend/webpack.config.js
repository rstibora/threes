const path = require("path")

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const WebpackCleanPlugin = require("webpack-clean-plugin")
const { WebpackManifestPlugin } = require("webpack-manifest-plugin")

const { VueLoaderPlugin } = require("vue-loader")

module.exports = {
    entry: {
        main: "./src/index.ts"
    },
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: "",
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                    transpileOnly: true,
                },
            },
            { 
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: "vue-loader",
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    "vue-style-loader",
                    "css-loader",
                ]
            }
        ]
    },

    plugins: [
        new VueLoaderPlugin(),
        new WebpackManifestPlugin(),
        new WebpackCleanPlugin({ root: path.join(__dirname, 'dist') }),
        new ForkTsCheckerWebpackPlugin({ typescript: { extensions: { vue: {
            enabled: true,
            compiler: "@vue/compiler-sfc",}
        }}}),
    ],

    mode: "development",
    // watch: true,
};
