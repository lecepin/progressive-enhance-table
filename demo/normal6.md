---
title: 合并单元格
order: 5
---

使用 `cellProps` 进行处理，返回需要合并的信息。

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
        ]}
        autoWidth
        round
        cellProps={(rowIndex, colIndex, dataIndex, record) => {
          if (record.name == "张三" && dataIndex == "name") {
            return { colSpan: 3 };
          }

          if (record.name == "王五" && dataIndex == "sex") {
            return { colSpan: 2, rowSpan: 2 };
          }
        }}
      />
    </div>
  );
};

ReactDOM.render(<App />, mountNode);
```
