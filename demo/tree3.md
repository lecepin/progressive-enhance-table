---
title: 树型表格-group 视图
order: 22
---

设置 `isTree` 开启树型。通过 `isTreeGroupView` 进行设置。

```jsx
import React from "react";
import ReactDOM from "react-dom";
import PETable from "pe-table";

const App = () => {
  return (
    <div>
      <PETable
        columns={[
          {
            dataIndex: "name",
            title: "姓名",
            alignHeader: "center",
            width: 100,
          },
          {
            dataIndex: "sex",
            title: "性别",
            width: 100,
            align: "center",
          },
          {
            dataIndex: "age",
            title: "年龄",
            width: 100,
          },
        ]}
        dataSource={[
          {
            id: 1,
            name: "张三",
            age: 18,
            sex: "男",
            isLeaf: false,
            children: [
              {
                id: 11,
                name: "张三1",
                age: 118,
                sex: "男1",
                isLeaf: false,
                children: [
                  {
                    id: 111,
                    name: "张三12",
                    age: 1128,
                    sex: "男12",
                    isLeaf: true,
                    children: [],
                  },
                  {
                    id: 112,
                    name: "张三13 非叶子无子",
                    age: 11238,
                    sex: "男13",
                    isLeaf: false,
                    children: [],
                  },
                ],
              },
              {
                id: 12,
                name: "张三2 非叶子无子",
                age: 128,
                sex: "男2",
                isLeaf: false,
                children: [],
              },
            ],
          },
          {
            id: 2,
            name: "张四 无",
            age: 19,
            sex: "男",
            isLeaf: true,
            children: [],
          },
          {
            id: 3,
            name: "赵六 非叶子无子",
            age: 21,
            sex: "女",
            isLeaf: false,
            children: [],
          },
        ]}
        defaultOpenRowKeys={[1]}
        isTree
        isTreeGroupView
        autoWidth
        round
      />
    </div>
  );
};

ReactDOM.render(<App />, mountNode);
```
