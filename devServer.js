const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
const config = require("./webpack.config.js")();
const compiler = webpack(config);
const express = require("express");
const app = express();
 
app.use(
    middleware(compiler, {
        index: "src/index.html",
        publicPath: config.output.publicPath,
        stats: "minimal" //logLevel: "warn"
    })
);
app.use("/", express.static("assets"));
 
app.listen(8080, () => console.log("Development server running on port 8080"));