---
title: 树型表格-异步加载
order: 21
---

配合 `loadData` 进行实现。

```jsx
import React from "react";
import ReactDOM from "react-dom";
import PETable from "pe-table";

const App = () => {
  const [openKeys, setOpenKeys] = React.useState([]);
  const [asyncDs, setAsyncDs] = React.useState([
    {
      id: 1,
      name: "张三",
      age: 18,
      sex: "男",
      isLeaf: false,
      children: [],
    },
    {
      id: 2,
      name: "李四(加载后 无节点)",
      age: 19,
      sex: "男",
      isLeaf: false,
      children: [],
    },
    {
      id: 3,
      name: "王五",
      age: 21,
      sex: "女",
      isLeaf: false,
      children: [],
    },
    {
      id: 4,
      name: "赵六(加载后 报错)",
      age: 19,
      sex: "男",
      isLeaf: false,
      children: [],
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
        dataSource={asyncDs}
        onRowOpen={(openRowKeys, id, open, record) => {
          setOpenKeys(openRowKeys);
        }}
        openRowKeys={openKeys}
        loadData={(record) => {
          console.log({ record });
          console.log("load data...");
          return new Promise((resolve, rej) => {
            setTimeout(() => {
              setAsyncDs((asyncDs) => {
                const loop = function (cols) {
                  cols.forEach((col) => {
                    if (col.id === record.id) {
                      if (col.id === 2) {
                        col.isLeaf = true;

                        return;
                      }

                      if (col.id === 4) {
                        rej();
                        return;
                      }

                      col.children = [...new Array(3)].map((_, i) => ({
                        ...record,
                        id: `${record.id}-${i + 1}`,
                        name: `${record.name}-${i + 1}`,
                      }));

                      return;
                    }
                    if (col.children) {
                      loop(col.children);
                    }
                  });
                };

                loop(asyncDs);
                return [...asyncDs];
              });

              resolve();
            }, 1000 + 2000 * Math.random());
          });
        }}
        isTree
        autoWidth
      />
    </div>
  );
};

ReactDOM.render(<App />, mountNode);
```
