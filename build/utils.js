/*
 * @Author: Dong
 * @Date: 2022-01-26 09:58:32
 * @LastEditors: Dong
 * @LastEditTime: 2022-03-14 16:56:41
 */
const chalk = require("chalk");

module.exports.clearConsole = () => {
  process.stdout.write(
    process.platform === "win32" ? "\x1Bc" : "\x1B[2J\x1B[3J\x1B[H"
  );
};

module.exports.log = (str, opt = {}) => {
  const { bold, color } = { bold: true, color: "green", ...opt };
  const colorLabel = bold ? chalk[color].bold(str) : chalk[color](str);
  return colorLabel;
};

module.exports.runPromiseByQueue = (attr) => {
  attr.reduce(
    (prev, cur) =>
      prev.then(() => {
        const result = cur();
        if (result.status === 1) {
          return Promise.reject();
        }
        return Promise.resolve();
      }).catch((err)=>{
        console.log('err',err)
      }),
    Promise.resolve()
  );
};
