/*
 * @Author: Dong
 * @Date: 2022-01-25 11:22:56
 * @LastEditors: Dong
 * @LastEditTime: 2022-02-10 10:42:59
 */
const replace = require("@rollup/plugin-replace");
// 处理ts代码
const typescript = require("@rollup/plugin-typescript");
// 处理es6代码的转换
const { babel } = require("@rollup/plugin-babel");
// 查找依赖的第三方库
const { nodeResolve } = require("@rollup/plugin-node-resolve");
// 处理commonjs模块
const commonjs = require("@rollup/plugin-commonjs");
// 处理样式文件
const postcss = require("rollup-plugin-postcss");

const getBabelConfig = require("./getBabelConfig");
const customConfig = require("../rollupconfig.json");
const pkg = require("../package.json");

const { dependencies, peerDependencies } = pkg;

const getRollupConfig = (output, mode) => {
  const { format } = output;
  const babelConfig = getBabelConfig({ format });
  const external = [
    ...Object.keys(dependencies || {}),
    ...Object.keys(peerDependencies || {}),
  ];

  const input =
    mode === "development" && customConfig.dev && customConfig.dev.input
      ? customConfig.dev.input
      : mode === "production" && customConfig.prod && customConfig.prod.input
      ? customConfig.prod.input
      : customConfig.input ||
        "./src/index.tsx" ||
        "./src/index.jsx" ||
        "./src/index.ts" ||
        "./src/index.js";

  return {
    input,
    output,
    plugins: [
      postcss(),
      nodeResolve(),
      typescript(),
      babel({ ...babelConfig }),
      commonjs(),
      replace({
        "process.env.NODE_ENV":
          mode === "development"
            ? JSON.stringify("development")
            : JSON.stringify("production"),
        preventAssignment: false,
      }),
    ],
    external: mode === "development" ? [] : external,
  };
};

module.exports = getRollupConfig;
