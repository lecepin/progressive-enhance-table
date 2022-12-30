---
title: 空数据
order: 4
---

可以使用 `emptyContent` 进行自定义空数据。

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
        dataSource={[]}
        autoWidth
        round
      />
    </div>
  );
};

ReactDOM.render(<App />, mountNode);
```
