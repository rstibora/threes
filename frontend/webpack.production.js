import DotenvWebpackPlugin from "dotenv-webpack"
import path from "path"
import { merge } from "webpack-merge"

import common from "./webpack.common.js"


export default merge(common, {
    mode: "production",
    plugins: [
        new DotenvWebpackPlugin({ path: "./configuration/production.env"})
    ]
})
