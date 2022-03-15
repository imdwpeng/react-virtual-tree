/*
 * @Author: Dong
 * @Date: 2022-03-14 16:30:05
 * @LastEditors: Dong
 * @LastEditTime: 2022-03-15 11:01:51
 */
import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import FastTree from "./index";

const getData = (parent?: any, level = 3) => {
  const list = [];
  for (let i = 0; i < 10; i += 1) {
    const path = parent ? `${parent}_${i + 1}` : `${i + 1}`;
    const node = {
      id: path,
      title: `title_${path}`,
      children: [] as any[],
    };

    if (level > 0) {
      node.children = getData(path, level - 1);
    }

    list.push({ ...node });
  }
  return list;
};

const Demo = () => {
  const [menuData, setMenuData] = useState<any[]>([]);
  const [expandKeys, setExpandKeys] = useState<any[]>([]);

  useEffect(() => {
    const newMenuData: any[] = getData();
    setMenuData(newMenuData);
  }, []);

  const handleExpandChange = (newKeys: any[]) => {
    console.log(newKeys);
    setExpandKeys(newKeys);
  };

  return (
    <div style={{ height: 790, width: 160 }}>
      <FastTree
        // uniqKey="key"
        //   showSwitcherIcon={false}
        itemHeight={40}
        dataSource={menuData}
        // selectedKeys={selectedKeys}
        expandKeys={expandKeys}
        onExpandChange={handleExpandChange}
        render={(item) => <div>{item.title}</div>}
      />
    </div>
  );
};

render(<Demo />, document.getElementById("root"));
