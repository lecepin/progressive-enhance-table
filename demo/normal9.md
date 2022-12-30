---
title: 合并表头
order: 8
---

在 `columns` 中设置 `children` 进行实现。

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
        ]}
        columns={[
          {
            dataIndex: "name",
            title: "姓名",
            alignHeader: "center",
            align: "center",
            width: 100,
          },
          {
            dataIndex: "sex",
            title: "性别",
            alignHeader: "center",
            children: [
              {
                dataIndex: "boy",
                title: "男",
                width: 100,
              },
              { dataIndex: "girl", title: "女", width: 100 },
            ],
          },
          {
            dataIndex: "age",
            title: "年龄",
            width: 100,
          },
          {
            dataIndex: "addr",
            title: "地区",
            alignHeader: "center",
            children: [
              {
                dataIndex: "in",
                title: "国内",
                alignHeader: "center",

                children: [
                  {
                    dataIndex: "bj",
                    title: "北京",
                    width: 100,
                  },
                  {
                    dataIndex: "sh",
                    title: "上海",
                    width: 100,
                  },
                  {
                    dataIndex: "hz",
                    title: "杭州",
                    width: 100,
                  },
                ],
              },
              { dataIndex: "out", title: "国外", width: 100 },
            ],
          },
        ]}
        autoWidth
      />
    </div>
  );
};

ReactDOM.render(<App />, mountNode);
```
