---
title: 最大高度
order: 6
---

使用 `maxHeight` 进行设置。

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
          { id: 1, name: "张三", sex: "男", age: "18" },
          { id: 2, name: "李四", sex: "女", age: "28" },
          { id: 3, name: "王五", sex: "女", age: "48" },
          { id: 4, name: "赵六", sex: "男", age: "8" },
          { id: 11, name: "张三", sex: "男", age: "18" },
          { id: 12, name: "李四", sex: "女", age: "28" },
          { id: 13, name: "王五", sex: "女", age: "48" },
          { id: 14, name: "赵六", sex: "男", age: "8" },
        ]}
        autoWidth
        round
        maxHeight={200}
      />
    </div>
  );
};

ReactDOM.render(<App />, mountNode);
```
