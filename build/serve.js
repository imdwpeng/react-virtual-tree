/*
 * @Author: Dong
 * @Date: 2022-01-26 09:05:51
 * @LastEditors: Dong
 * @LastEditTime: 2022-03-15 14:03:41
 */
const rollup = require("rollup");
const serve = require("rollup-plugin-serve");
const getRollupConfig = require("./getRollupConfig");
const outputs = require("./outputs");
const customConfig = require("../rollupconfig.json");
const { log, clearConsole } = require("./utils");

const watchOptions = [];

const port =
  (customConfig && customConfig.devServe && customConfig.devServe.port) || 8080;

outputs.forEach((output, i) => {
  const rollupConfig = getRollupConfig(output, "development");

  if (i === outputs.length - 1) {
    rollupConfig.plugins.push(
      serve({
        port,
        contentBase: "",
      })
    );
  }

  watchOptions.push(rollupConfig);
});

const watcher = rollup.watch(watchOptions);

let timer = 0;
let buildCount = 0;
watcher.on("event", (event) => {
  switch (event.code) {
    case "START":
      clearConsole();
      console.log("Starting the development server...");
      break;
    case "BUNDLE_END":
      timer += event.duration;
      buildCount += 1;
      console.log(
        `${log("[INFO]")} build`,
        log(event.output[0], { bold: false }),
        "in",
        log(`${(event.duration / 1000).toFixed(2)}s`, { bold: false })
      );
      break;
    case "END":
      if (buildCount === outputs.length) {
        console.log(
          `Compiled successfully in`,
          log(`${(timer / 1000).toFixed(2)}s`, { bold: false })
        );
        console.log("Project is running at", log(`http://localhost:${port}`));
      } else {
        console.log("Compiled Error");
      }
      timer = 0;
      buildCount = 0;
      break;
    case "ERROR":
    case "FATAL":
      console.log(event.error);
      timer = 0;
      buildCount = 0;
      break;
    default:
      break;
  }
});
