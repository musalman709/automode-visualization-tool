/* eslint-disable no-undef */
const path = require("path");

module.exports = env => {
    const isProduction = env && env.production;
    return {
        mode: isProduction ? "production" : "development",
        entry: "./src/index.js",
        output: {
            filename: "main.js",
            path: path.resolve(__dirname, "dist")
        },
        devtool: isProduction ? false : "cheap-module-eval-source-map",
        devServer: {
            contentBase: path.join(__dirname, "src"),
            compress: true,
            historyApiFallback: true,
            overlay: true,
            stats: "minimal",
            port: 8080,
    
        },
        module: {
            rules: [
                { test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader" }
            ]
        }
    };
};