/*
 * @Author: Dong
 * @Date: 2022-01-17 11:18:00
 * @LastEditors: Dong
 * @LastEditTime: 2022-03-14 10:46:56
 */
import React, { useEffect, useState, useRef, useMemo, useReducer } from "react";
import { INIT_ITEM_HEIGHT, INIT_SPACE } from "./defaultProps";
import { cloneDeep } from "./utils";
import "./index.less";
import { dataReducer, dataInitState } from "./dataReducer";

const prefixcl = "virtual-tree";

const initProps = {
  showSwitcherIcon: true,
  defaultExpandAll: false,
  uniqKey: "id",
  itemHeight: INIT_ITEM_HEIGHT,
  space: INIT_SPACE,
};

interface PropsType {
  dataSource: any[]; // 数据源
  showSwitcherIcon?: boolean; // 显示展开折叠图标
  defaultExpandAll?: boolean; // 默认展开所有
  itemHeight?: number; // 节点高度
  space?: number; // 层级间隔
  uniqKey?: string; // 唯一键值
  selectedKeys?: Array<string>; // 选中项
  expandKeys?: Array<string>; // 展开项
  onSelect?: (selectedItem: any) => void; // 选中节点操作
  onExpandChange?: (expandKeys: Array<string>) => void; // 展开收起操作
  render: (arg0: any) => JSX.Element; // 渲染节点
}

const FastTree = (props: PropsType) => {
  const {
    dataSource,
    render,
    selectedKeys,
    expandKeys,
    onSelect,
    onExpandChange,
    ...resProps
  } = props;
  const { defaultExpandAll, itemHeight, space, showSwitcherIcon, uniqKey } = {
    ...initProps,
    ...resProps,
  };
  const didMountRef = useRef(false);
  const treeRef = useRef<HTMLDivElement>(null);

  const [visibleData, setVisibleData] = useState<any[]>([]); // 可见数据
  const [contentHeight, setContentHeight] = useState<number>(0); // 列表高度，用于显示滚动条
  const [offset, setOffset] = useState<number>(0); // 偏移量
  const [innerSelectedKeys, setInnerSelectedKeys] = useState<string[]>([]); // 选中项

  const [dataState, dataDispatch] = useReducer(dataReducer, dataInitState);

  // 列表显示数量
  const visibleCount = useMemo(
    () => Math.ceil((treeRef?.current?.clientHeight || 0) / itemHeight),
    [treeRef?.current?.clientHeight]
  );

  // 更新可见数据
  const updateVisibleData = (scrollTop = 0) => {
    let start = Math.floor(scrollTop / itemHeight);
    let end = start + visibleCount;

    const len = dataState.allVisibleData.length;
    const iHeight = len * itemHeight;

    // 加入缓冲区，解决快速滚动时，产生白屏
    // 可视区域上方缓存，保证start>=0
    start = Math.max(start - visibleCount, 0);
    // 可视区域下方缓冲
    end += Math.min(len - end, visibleCount);

    const newVisibleData = dataState.allVisibleData.slice(
      start,
      Math.min(end, len)
    );

    // 实际显示数量少于列表可显示数量时
    // 或者还处于可视区域上方缓冲区内，偏移量重置为0
    const newOffset =
      Math.floor(scrollTop / itemHeight) <= visibleCount || len <= visibleCount
        ? 0
        : scrollTop - (scrollTop % itemHeight) - visibleCount * itemHeight;

    setVisibleData(newVisibleData);
    setOffset(newOffset);
    setContentHeight(iHeight);
  };

  // 滚动加载
  const handleScroll = () => {
    const { scrollTop } = treeRef.current || {
      scrollTop: 0,
    };
    updateVisibleData(scrollTop);
  };

  // 初始化
  useEffect(() => {
    const params = { uniqKey, dataSource, expandKeys } as any;

    // 保证设置dataSource之后只初始化一次，主要是为了defaultExpandAll只在初始化时起作用
    if (!didMountRef.current && dataSource.length !== 0) {
      didMountRef.current = true;
      params.expandAll = defaultExpandAll && !expandKeys;
    }

    dataDispatch({
      type: "init",
      params: { ...params },
    });
  }, [dataSource]);

  useEffect(() => {
    handleScroll();
  }, [dataState.allVisibleData]);

  useEffect(() => {
    dataDispatch({
      type: "outerExpandChange",
      params: {
        expandKeys,
      },
    });
  }, [expandKeys]);

  // 展开收起
  const toggleExpand = (item: any) => {
    // 外部控制展开项
    if (expandKeys && onExpandChange) {
      const key = item[uniqKey];
      const index = expandKeys.indexOf(key);
      const newExpandKeys = cloneDeep(expandKeys);
      if (index === -1) {
        newExpandKeys.push(key);
      } else {
        newExpandKeys.splice(index, 1);
      }
      onExpandChange(newExpandKeys);
    } else {
      // 内部控制
      dataDispatch({
        type: "expandChange",
        params: {
          uniqKey,
          item,
        },
      });
    }
  };

  // 选择当前项
  const handleSelectItem = (item: any) => {
    const { children = [] } = item;
    // 存在子级，则展开收起
    if (children.length !== 0) {
      toggleExpand(item);
    }

    if (onSelect) {
      onSelect(item);
    }

    // 如果外部传入selectedKeys,则交给外部控制，否则由内部控制
    if (!selectedKeys) {
      setInnerSelectedKeys([item[uniqKey]]);
    }
  };

  return (
    <div ref={treeRef} className={prefixcl} onScroll={handleScroll}>
      <div
        className={`${prefixcl}-scrollbar`}
        style={{ height: contentHeight }}
      />
      <div
        className={`${prefixcl}-content`}
        style={{ transform: `translate3d(0px, ${offset}px, 0px)` }}
      >
        {visibleData.length !== 0 &&
          visibleData.map((item: any) => {
            const openKeys = cloneDeep(expandKeys || dataState.expandKeys);
            const key = item[uniqKey];
            const isExpand = openKeys.includes(key);
            const { level, title, children = [] } = item;
            const iLeft = `${space * (level + 1)}px`;

            return (
              <div
                key={item[uniqKey]}
                className={`${prefixcl}-item ${
                  isExpand ? `${prefixcl}-item-open` : ""
                } ${
                  (selectedKeys || innerSelectedKeys)?.includes(key)
                    ? `${prefixcl}-item-selected`
                    : ""
                }`}
                style={{
                  paddingLeft: iLeft,
                  height: itemHeight,
                }}
                onClick={() => handleSelectItem(item)}
              >
                <div className={`${prefixcl}-item-content`}>
                  {showSwitcherIcon && children && children.length !== 0 && (
                    <span className={`${prefixcl}-triggle`}>
                      <i className={`${prefixcl}-icon`} />
                    </span>
                  )}
                  {render ? render(item) : <span>{title}</span>}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

FastTree.defaultProps = {
  ...initProps,
};

export default FastTree;
