/*
 * @Author: Dong
 * @Date: 2022-01-25 11:04:04
 * @LastEditors: Dong
 * @LastEditTime: 2022-03-15 10:46:29
 */
const getBabelConfig = (opts) => {
  const { format } = opts;
  return {
    presets: [
      [
        require.resolve("@babel/preset-env"),
        {
          targets: {
            browsers: ["last 2 versions", "IE 11"],
          },
          modules: false,
          loose: true,
        },
      ],
      require.resolve("@babel/preset-react"),
      require.resolve("@babel/preset-typescript"),
    ],
    plugins: [
      // 对于JSX文件，自动import React
      require.resolve("babel-plugin-react-require"),
      // @ 类表达式
      [require.resolve("@babel/plugin-proposal-decorators"), { legacy: true }],
      [
        require.resolve("@babel/plugin-transform-runtime"),
        {
          useESModules: format === "esm",
        },
      ],
    ],
    exclude: /\/node_modules\//,
    babelrc: false,
    extensions: [".js", ".jsx", ".ts", ".tsx", ".es6", ".es", ".mjs"],
    babelHelpers: "runtime",
  };
};

module.exports = getBabelConfig;
