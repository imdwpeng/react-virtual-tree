/*
 * @Author: Dong
 * @Date: 2022-01-25 14:11:53
 * @LastEditors: Dong
 * @LastEditTime: 2022-01-26 10:43:14
 */
const rollup = require("rollup");
const getRollupConfig = require("./getRollupConfig");
const outputs = require("./outputs");
const { log } = require("./utils");

let startTime;
const outputDirs = [];

async function build(config, output) {
  const bundle = await rollup.rollup(config);

  await bundle.generate(output);
  await bundle.write(output);

  outputDirs.push(output.file);

  if (outputDirs.length === outputs.length) {
    const endTime = new Date().getTime();

    console.log(
      `${log("[SUCCESS]")} created ${log(outputDirs.join(", "))}`,
      "in",
      `${log(`${((endTime - startTime) / 1000).toFixed(2)}s`, {
        bold: false,
      })}`
    );
  }
}

console.log("Starting build...");

outputs.forEach((output, i) => {
  if (i === 0) {
    startTime = new Date().getTime();
  }
  const rollupConfig = getRollupConfig(output, "production");
  build(rollupConfig, output);
});
