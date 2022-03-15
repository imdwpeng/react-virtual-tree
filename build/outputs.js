/*
 * @Author: Dong
 * @Date: 2022-01-25 14:14:49
 * @LastEditors: Dong
 * @LastEditTime: 2022-01-25 17:20:28
 */
const pkg = require("../package.json");

const isDev = process.env.NODE_ENV !== "production";

const name = pkg.name
  .split("-")
  .map((code) => code.substr(0, 1).toUpperCase() + code.substr(1))
  .join("");

const outputs = [];

if (pkg.main) {
  outputs.push({
    file: pkg.main,
    format: "cjs",
    exports: "auto",
  });
}

if (pkg.module) {
  outputs.push({
    file: pkg.module,
    format: "esm",
  });
}

if (pkg.browser) {
  outputs.push({
    file: pkg.browser,
    format: "umd",
    name,
  });
}

outputs.map((o) => {
  o.sourcemap = isDev;
  return o;
});

module.exports = outputs;
