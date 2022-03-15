/*
 * @Author: Dong
 * @Date: 2022-01-17 15:32:22
 * @LastEditors: Dong
 * @LastEditTime: 2022-03-11 16:34:23
 */

/**
 * 树转列表
 * @param tree 树数据
 * @param parent 父级链
 * @returns 转换后的列表数据
 */
export const flattenTree = ({
  tree,
  parent = null,
  level = 0,
  options = {},
}: {
  tree: any[];
  parent?: any;
  level?: number;
  options: any;
}) => {
  const list: any[] = [];

  if (!tree || tree.length === 0) return [];

  tree.forEach((item: any) => {
    list.push({
      ...item,
      parent,
      level,
    });

    if (item.children && item.children.length !== 0) {
      list.push(
        ...flattenTree({
          tree: item.children,
          parent: item[options.uniqKey],
          level: level + 1,
          options,
        })
      );
    }
  });

  return list;
};

// 深拷贝
export const cloneDeep = (data: any) => {
  // 只拷贝对象
  if (!data || typeof data !== "object") return data;

  const object = new data.constructor();

  Object.keys(data).forEach((key) => {
    object[key] =
      typeof data[key] !== "object" ? data[key] : cloneDeep(data[key]);
  });

  return object;
};
