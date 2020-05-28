import { Configuration } from "webpack";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
// @ts-ignore
import CopyWebpackPlugin from "copy-webpack-plugin";
import { TsConfigPathsPlugin } from "awesome-typescript-loader";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

let mode: Configuration["mode"];

declare module "webpack" {
    interface Configuration {
        devServer: any;
    }
}

switch (process.env.NODE_ENV) {
    case "development":
    case "production":
        mode = process.env.NODE_ENV;
        break;
    case "none":
    default:
        mode = "production";
        break;
}

console.log(`MODE: ${ mode }`);

const config: Configuration = {
    entry: path.join(__dirname, "src/main.ts"),
    output: { publicPath: "/" },
    target: "web",
    mode,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    resolve: {
        extensions: [ ".js", ".ts", ".jsx", ".tsx" ],
        plugins: [
            new TsConfigPathsPlugin(),
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.join(__dirname, "assets"),
                to: path.join(__dirname, "dist/assets"),
            }],
        }),
    ],
    devServer: {
        proxy: {
            '/api': 'http://localhost:9000/'
        },
        historyApiFallback: true
    }
};

if (mode === "development") {
    config.devtool = "source-map";
}

export default config;
