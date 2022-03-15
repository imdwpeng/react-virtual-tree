/* eslint-disable @typescript-eslint/no-var-requires */

const inquirer = require("inquirer");
const spawn = require("cross-spawn");
const yargs = require("yargs");
const pkg = require("../package.json");
const { runPromiseByQueue } = require("./utils");

const { registry } = yargs.argv || {};
const version = pkg.version.split(".");
let selectedVersion;

// 获取新版本选择列表
const getNewVersions = () => {
  const list = [];

  version.forEach((v, i) => {
    const thisVersion = [...version];

    thisVersion[i] = thisVersion[i] - 0 + 1;

    switch (i) {
      // major
      case 0:
        thisVersion[1] = 0;
        thisVersion[2] = 0;
        break;
      // minor
      case 1:
        thisVersion[2] = 0;
        break;
      default:
        break;
    }

    list.unshift(thisVersion.join("."));
  });

  list.push("自定义");

  return list;
};

const versionList = getNewVersions();

// eslint校验代码
const lintSpawn = () =>
  spawn.sync("npm", ["run", "lint"], { stdio: "inherit" });

// 执行升版之前需要先保证本地代码已经commit
const commitSpawn = () => {
  spawn.sync("git", ["add", "."], { stdio: "inherit" });
  return spawn.sync("git", ["commit", "-m", selectedVersion], {
    stdio: "inherit",
  });
};

// 升级版本
const updateVersionSpawn = () => {
  console.log("升级版本为：", selectedVersion);
  return spawn.sync("npm", ["version", selectedVersion]);
};

// 编译代码
const buildSpawn = () => {
  console.log(`
  ==================================================
    编译代码
  ==================================================
  `);

  return spawn.sync("npm", ["run", "build"], { stdio: "inherit" });
};

// 发布NPM包
const publishSpawn = () => {
  console.log(`
  ==================================================
    编译成功，发布NPM包
  ==================================================
  `);

  return spawn.sync(
    "npm",
    ["publish", `${registry ? `--registry=${registry}` : ""}`],
    {
      stdio: "inherit",
    }
  );
};

// 提交远程仓库
const pushGitSpawn = () => {
  console.log(`
  ==================================================
  发布NPM包成功，提交远程仓库
  ==================================================
  `);

  spawn.sync("git", ["add", "."], { stdio: "inherit" });
  spawn.sync("git", ["commit", "-m", selectedVersion], { stdio: "inherit" });
  spawn.sync("git", ["pull"], { stdio: "inherit" });
  return spawn.sync("git", ["push"], { stdio: "inherit" });
};

const spawnQueue = () =>
  runPromiseByQueue([
    lintSpawn,
    commitSpawn,
    updateVersionSpawn,
    buildSpawn,
    publishSpawn,
    pushGitSpawn,
  ]);

// 自定义版本
const customVersion = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "version",
        message: "输入新版本：",
        validate: (val) => {
          // 校验版本格式
          const newVersion = val.split(".");
          let validStatus = true;

          if (newVersion.length !== 3) {
            validStatus = false;
          }

          return !validStatus ? "请输入正确的版本格式：*.*.*" : true;
        },
      },
    ])
    .then((answers) => {
      const newVersion = answers.version;
      selectedVersion = newVersion;
      spawnQueue();
    });
};

inquirer
  .prompt([
    {
      type: "list",
      name: "version",
      message: `当前版本为V${pkg.version}，升级版本`,
      choices: versionList,
    },
  ])
  .then((answers) => {
    const selected = answers.version;
    selectedVersion = selected;
    if (selected === "自定义") {
      customVersion();
    } else {
      spawnQueue();
    }
  });
