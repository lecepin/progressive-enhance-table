---
title: 常规
order: 0
---

```jsx
import React from "react";
import ReactDOM from "react-dom";
import PETable from "pe-table";

const App = () => {
  const [ds, setDs] = React.useState([
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
      isCanDrag: false,
    },
  ]);
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
        dataSource={ds}
        defaultOpenRowKeys={[1]}
        // isTree
        autoWidth
        canDragRow
        onDragRowIsAvailable={(a, b) => {
          function loop(nodes, dragNode) {
            if (!Array.isArray(nodes)) {
              return;
            }
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id == dragNode.id) {
                return true;
              }

              if (loop(nodes[i].children, dragNode)) {
                return true;
              }
            }
          }

          return !loop(a?.children, b);
        }}
        onDragRowEnd={(a, b, c) => {
          console.log("end", a, b, c);
          function loopInsert(nodes, dragNode, dropNode, pos) {
            if (!Array.isArray(nodes)) {
              return;
            }
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id == dropNode.id) {
                nodes.splice(pos == "top" ? i : i + 1, 0, dragNode);
                return true;
              }

              if (loopInsert(nodes[i].children, dragNode, dropNode, pos)) {
                return true;
              }
            }
          }
          function loopDel(nodes, dragNode) {
            if (!Array.isArray(nodes)) {
              return;
            }
            for (let i = 0; i < nodes.length; i++) {
              if (nodes[i].id == dragNode.id) {
                nodes.splice(i, 1);
                return true;
              }

              if (loopDel(nodes[i].children, dragNode)) {
                return true;
              }
            }
          }
          loopDel(ds, a);
          loopInsert(ds, a, b, c);
          console.log(ds);
          setDs([...ds]);
        }}
      />
    </div>
  );
};

ReactDOM.render(<App />, mountNode);
```
