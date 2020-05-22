/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
module.exports = function({
    resources,
    options
}) {
    const fs = require("fs");
    const httpProxy = require("http-proxy");
    const proxy = new httpProxy.createProxyServer({
        changeOrigin: true
    });
    const odata = fs.readFileSync("./odata.json");
    const routing = JSON.parse(odata);
    return function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization, X-Mindflash-SessionID");
        // intercept OPTIONS method
        if ("OPTIONS" === req.method) {
            res.header(200);
            console.log(req.method + "(options): " + req.url);
            next();
            return;
        }
        var dirname = req.url.replace(/^\/([^\/]*).*$/, "$1"); //get root directory name eg sdk, app, sap
        if (!routing[dirname]) {
            console.log(req.method + ": " + req.url);
            next();
            return;
        }
        console.log(req.method + " (redirect): " + routing[dirname].target + req.url);
        proxy.web(req, res, routing[dirname], function(err) {
            if (err) {
                next(err);
            }
        });
    };
};