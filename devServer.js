const { execFile } = require('child_process');
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
app.use(express.json());

app.post("/run", (req, res) => {
    if (!process.env.AUTOMODE_PATH || !process.env.EXPERIMENT_PATH) {
        console.error("AutoMoDe or experiment path not set");
        res.sendStatus(500);
        return;
    }
    const {name, value} = req.body;
    if (!name || typeof name !== "string"
        || !value || typeof value !== "string") {
        res.sendStatus(400);
        return;
    }
    execFile(process.env.AUTOMODE_PATH, 
        ["--config-file", process.env.EXPERIMENT_PATH, name, value],
        (error, stdout, stderr) => {
        if (error) {
            console.error("Could not start AutoMoDe: " + error.message);
        } else {
            console.log("-----AutoMoDe output-----");
            console.error(stderr);
            console.log(stdout);
            console.log("-------------------------");
        }
      });
    res.sendStatus(200);
});
 
app.listen(8080, () => console.log("Application running on port 8080"));