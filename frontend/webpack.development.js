import DotenvWebpackPlugin from "dotenv-webpack"
import { merge } from "webpack-merge"

import common from "./webpack.common.js"


export default merge(common, {
    mode: "development",
    // Likely has an impact on the build time.
    devtool: "eval-source-map",
    plugins: [
        new DotenvWebpackPlugin({ path: "./configuration/development.env"})
    ]
})
