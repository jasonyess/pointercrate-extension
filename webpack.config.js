const path = require("path")

module.exports = {
  entry: {
    statsviewer: ["./js/utils.js", "./js/statsviewer.js"], // statsviewer bundle
    pendingdemons: ["./js/utils.js", "./js/pendingdemons.js"], // pendingdemons bundle
    scorecalculator: ["./js/utils.js", "./js/scorecalculator.js"], // scorecalculator bundle
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
}
