---
title: 列宽调整-冻结列
order: 10
---

在 `columns` 中设置 `resizable: true` 进行实现，配合回调函数 `onResizeChange`。

```jsx
import React from "react";
import ReactDOM from "react-dom";
import PETable from "pe-table";

const App = () => {
  const [resizeCols1, setResizeCols1] = React.useState([
    {
      dataIndex: "name",
      title: "姓名",
      alignHeader: "center",
      align: "center",
      width: 100,
      lock: "left",
      resizable: true,
    },
    {
      dataIndex: "sex",
      title: "性别",
      width: 100,
      lock: "left",
      resizable: true,
    },
    {
      dataIndex: "age",
      title: "年龄",
      width: 100,
      lock: "right",
      resizable: true,
    },
    {
      dataIndex: "a",
      title: "a",
      width: 100,
      resizable: true,
    },
    {
      dataIndex: "ab",
      title: "b",
      width: 100,
    },
    {
      dataIndex: "c",
      title: "c",
      width: 100,
    },
    {
      dataIndex: "d",
      title: "d",
      width: 100,
    },
    {
      dataIndex: "e",
      title: "e",
      width: 100,
    },
    {
      dataIndex: "f",
      title: "f",
      width: 100,
    },
    {
      dataIndex: "g",
      title: "g",
      width: 100,
    },
    {
      dataIndex: "aa",
      title: "a1",
      width: 100,
    },
    {
      dataIndex: "ab",
      title: "b1",
      width: 100,
    },
    {
      dataIndex: "ac",
      title: "c1",
      width: 100,
    },
    {
      dataIndex: "ad",
      title: "d1",
      width: 100,
    },
    {
      dataIndex: "ae",
      title: "e1",
      width: 100,
    },
    {
      dataIndex: "af",
      title: "f1",
      width: 100,
    },
    {
      dataIndex: "ag",
      title: "g1",
      width: 100,
      resizable: true,
    },
  ]);

  return (
    <div>
      <PETable
        dataSource={[
          { id: 1, name: "张三", sex: "男", age: "18" },
          { id: 2, name: "李四", sex: "女", age: "28" },
        ]}
        round
        columns={resizeCols1}
        onResizeChange={(colIndex, width) => {
          console.log({ colIndex, width });

          const loop = function (cols) {
            cols.forEach((col) => {
              if (col.dataIndex === colIndex) {
                col.width = width;
                return;
              }
              if (col.children) {
                loop(col.children);
              }
            });
          };

          loop(resizeCols1);
          setResizeCols1([...resizeCols1]);
        }}
      />
    </div>
  );
};

ReactDOM.render(<App />, mountNode);
```
