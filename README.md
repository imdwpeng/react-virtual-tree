# react-virtual-tree

虚拟列表树

-------------------------

## 依赖

根据各自项目安装缺少的依赖

- react@16.x
- react-dom@16.x

------------------------------------

## 本地开发

```js
git clone https://github.com/imdwpeng/react-virtual-tree.git
cd react-virtual-tree
npm start
```

## 发布

```js
npm run pub
```

## 使用

```js
import VirtualTree from 'react-virtual-tree';

const menuData = [
  {
    id: '1',
    title: '1',
    children: [
      {
        id: '1-1',
        title: '1-1'
      },
      {
        id: '1-2',
        title: '1-2'
      }
    ]
  },
  {
    id: '2',
    title: '2',
    children: [
      {
        id: '2-1',
        title: '2-1'
      },
      {
        id: '2-2',
        title: '2-2'
      }
    ]
  }
]

<div style={{ height: 790, width: 160 }}>
      <VirtualTree
        uniqKey="key"
        showSwitcherIcon={false}
        itemHeight={40}
        dataSource={menuData}
        selectedKeys={selectedKeys}
        expandKeys={expandKeys}
        onExpandChange={handleExpandChange}
        render={(item) => <div>{item.title}</div>}
      />
    </div>
```

-------------------------------------

## 属性

参数|说明|类型/数据格式|默认值
--|--|--|--
dataSource|树结构数据|array|-
defaultExpandAll | 默认展开父节点	| boolean	| false
expandKeys|（受控）展开指定的树节点，与onExpandChange配合使用 | string[] | -
itemHeight | 行高 | number | 24
selectedKeys |（受控）设置选中的树节点，与onSelect配合使用 | string[] | -
space | 间隔 | number | 24
showSwitcherIcon | 自定义树节点的展开/折叠图标 | boolean | false
uniqKey|行 key 的取值|string|'id'
render | 渲染节点函数 | (item) => JSX.Element | -
onExpandChange | 展开/收起节点时触发 | function(expandedKeys) | -
onSelect | 点击树节点触发 | function(selectedNode) | -

------------------------------------


# 历史记录

详情请参考 [CHANGELOG](./CHANGELOG.md)
