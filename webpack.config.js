const path = require("path")

module.exports = {
  entry: {
    statsviewer: ["./js/utils.js", "./js/statsviewer.js"],
    nationstatsviewer: ["./js/utils.js", "./js/nationstatsviewer.js"],
    clanstatsviewer: ["./js/utils.js", "./js/clanstatsviewer.js"],
    pendingdemons: ["./js/utils.js", "./js/pendingdemons.js"],
    scorecalculator: ["./js/utils.js", "./js/scorecalculator.js"],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
}
