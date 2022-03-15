/*
 * @Author: Dong
 * @Date: 2022-03-11 10:51:10
 * @LastEditors: Dong
 * @LastEditTime: 2022-03-14 16:20:58
 */
import { cloneDeep, flattenTree } from "./utils";

let listObject: any = {};

export interface dataStateTypes {
  list: any[];
  allVisibleData: any[];
  expandKeys: string[];
}

const checkQueue = ({
  expandKeys,
  key,
}: {
  expandKeys: string[];
  key: string;
}): boolean => {
  let parent = key;
  while (parent && expandKeys.includes(parent)) {
    const parentNode = listObject[parent];
    parent = parentNode.parent;
  }

  // 递归到根节点，说明存在完整展开链
  return parent === null;
};

const getAllVisibleData = ({
  list,
  expandAll,
  expandKeys,
}: {
  list: any[];
  expandAll?: boolean;
  expandKeys: string[];
}) => {
  let allVisibleData = [];

  // 展开全部
  if (expandAll) return cloneDeep(list);

  // 展示根节点
  if (!expandKeys || expandKeys.length === 0)
    return list.filter((item: any) => !item.parent);

  allVisibleData = list.filter((item: any) => {
    // 返回所有根节点
    if (!item.parent) return true;

    return checkQueue({
      expandKeys,
      key: item.parent,
    });
  });
  return allVisibleData;
};

// 数据初始化
const init = (params: any) => {
  const { uniqKey, dataSource = [], expandAll, expandKeys = [] } = params;
  const options = { uniqKey } as any;
  const list = flattenTree({ tree: dataSource, options });

  // 储存list的map，便于后面查找
  listObject = list.reduce((total, current) => {
    total[current[uniqKey]] = current;
    return total;
  }, {});

  const allVisibleData = getAllVisibleData({ ...params, list });
  const openKeys = expandAll
    ? list.reduce(
        (total: any[], current: any) => total.push(current[uniqKey]),
        []
      )
    : expandKeys;

  return {
    list,
    expandKeys: openKeys,
    allVisibleData,
  };
};

// 内部控制展开项变化
const expandChange = (params: any, state: dataStateTypes) => {
  const { uniqKey, item } = params;
  const { allVisibleData, list, expandKeys } = state;
  const key = item[uniqKey];
  const isExpand = !expandKeys.includes(key);
  let newAllVisibleData = [];
  const newExpandKeys = cloneDeep(expandKeys);

  // 收起
  if (!isExpand) {
    newExpandKeys.splice(newExpandKeys.indexOf(key), 1);

    const parents = [key];
    allVisibleData.forEach((obj: any) => {
      if (parents.includes(obj.parent)) {
        parents.push(obj[uniqKey]);
      } else {
        newAllVisibleData.push({ ...obj });
      }
    });
  } else {
    // 展开
    newExpandKeys.push(key);
    newAllVisibleData = getAllVisibleData({
      ...params,
      expandKeys: newExpandKeys,
      list,
    });
  }

  return {
    expandKeys: newExpandKeys,
    allVisibleData: newAllVisibleData,
  };
};

// 外部控制展开项变化
const outerExpandChange = (
  params: { expandKeys: string[]; uniqKey: string },
  state: dataStateTypes
) => {
  const { expandKeys } = params;
  const allVisibleData = getAllVisibleData({
    list: state.list,
    expandKeys,
  });
  return {
    allVisibleData,
  };
};

const reducer: any = {
  init,
  expandChange,
  outerExpandChange,
};

const dataReducer = (
  state: dataStateTypes,
  action: { type: string; params?: any }
) => {
  const { type, params = {} } = action;
  if (!reducer[type]) return state;
  return {
    ...state,
    ...reducer[type](params, state),
  };
};

// 初始值
const dataInitState: dataStateTypes = {
  list: [],
  allVisibleData: [],
  expandKeys: [],
};

export { dataReducer, dataInitState };
