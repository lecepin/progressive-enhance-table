---
title: 冻结列
order: 7
---

在 `columns` 中设置 `lock` 进行实现。

```jsx
import React from "react";
import ReactDOM from "react-dom";
import PETable from "pe-table";

const App = () => {
  return (
    <div>
      <PETable
        dataSource={[
          { id: 1, name: "张三", sex: "男", age: "18" },
          { id: 2, name: "李四", sex: "女", age: "28" },
          { id: 3, name: "王五", sex: "女", age: "48" },
          { id: 4, name: "赵六", sex: "男", age: "8" },
          { id: 11, name: "张三", sex: "男", age: "18" },
          { id: 12, name: "李四", sex: "女", age: "28" },
          { id: 13, name: "王五", sex: "女", age: "48" },
          { id: 14, name: "赵六", sex: "男", age: "8" },
        ]}
        columns={[
          {
            dataIndex: "name",
            title: "姓名",
            alignHeader: "center",
            align: "center",
            width: 100,
            lock: "left",
          },
          {
            dataIndex: "sex",
            title: "性别",
            width: 100,
            lock: "left",
          },
          {
            dataIndex: "age",
            title: "年龄",
            width: 100,
            lock: "right",
          },
          {
            dataIndex: "age",
            title: "a",
            width: 100,
          },
          {
            dataIndex: "age",
            title: "b",
            width: 100,
          },
          {
            dataIndex: "age",
            title: "c",
            width: 100,
          },
          {
            dataIndex: "age",
            title: "d",
            width: 100,
          },
          {
            dataIndex: "age",
            title: "e",
            width: 100,
          },
          {
            dataIndex: "age",
            title: "f",
            width: 100,
          },
          {
            dataIndex: "age",
            title: "g",
            width: 100,
          },
          {
            dataIndex: "age",
            title: "a1",
            width: 100,
          },
          {
            dataIndex: "age",
            title: "b1",
            width: 100,
          },
          {
            dataIndex: "age",
            title: "c1",
            width: 100,
          },
          {
            dataIndex: "age",
            title: "d1",
            width: 100,
          },
          {
            dataIndex: "age",
            title: "e1",
            width: 100,
          },
          {
            dataIndex: "age",
            title: "f1",
            width: 100,
          },
          {
            dataIndex: "age",
            title: "g1",
            width: 100,
          },
        ]}
        round
        maxHeight={200}
      />
    </div>
  );
};

ReactDOM.render(<App />, mountNode);
```
