import path from "path"
import { fileURLToPath } from "url"

import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"
import webpack from "webpack"
import { WebpackManifestPlugin } from "webpack-manifest-plugin"

import { VueLoaderPlugin } from "vue-loader"

import { getGitInfo } from "./build/version.js"


const __dirname = path.dirname(fileURLToPath(import.meta.url))


export default {
    entry: {
        main: "./src/index.ts"
    },
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve("/media/ramdisk", 'dist'),
        publicPath: "",
        clean: true,
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, "src")
        },
        extensions: [".ts", ".js"]
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
                    projectReferences: true,
                    configFile: "build-tsconfig.json",
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
            },
            {
                test: /\.sass$/,
                use: [
                    "vue-style-loader",
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                indentedSyntax: true
                            }
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new VueLoaderPlugin(),
        new WebpackManifestPlugin(),
        new webpack.DefinePlugin({
            GIT_INFO: JSON.stringify(getGitInfo())
        }),
        new ForkTsCheckerWebpackPlugin({ typescript: { 
            configFile: "./build-tsconfig.json",
            extensions: { vue: {
                enabled: true,
                compiler: "@vue/compiler-sfc",}
        }}}),
    ],
};
