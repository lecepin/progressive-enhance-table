---
title: 简单表格
order: 1
---

```jsx
import React from "react";
import ReactDOM from "react-dom";
import PETable from "pe-table";

const App = () => {
  const props = {
    columns: [
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
    ],
    dataSource: [
      { id: 1, name: "张三", sex: "男", age: "18" },
      { id: 2, name: "李四", sex: "女", age: "28" },
      { id: 3, name: "王五", sex: "女", age: "48" },
      { id: 4, name: "赵六", sex: "男", age: "8" },
    ],
  };

  const [resizeCols1, setResizeCols1] = React.useState([
    {
      dataIndex: "name",
      title: "姓名",
      alignHeader: "center",
      align: "center",
      width: 100,
      resizable: true,
    },
    {
      dataIndex: "sex",
      title: "性别",
      width: 100,
      resizable: true,
    },
    {
      dataIndex: "age",
      title: "年龄",
      width: 100,
      resizable: true,
    },
  ]);

  const [resizeCols2, setResizeCols2] = React.useState([
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

  const [resizeCols3, setResizeCols3] = React.useState([
    {
      dataIndex: "name",
      title: "姓名",
      alignHeader: "center",
      width: 240,
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
      lock: "left",
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
      <h5>常规</h5>
      <PETable {...props} />

      <h5>自动宽度</h5>
      <PETable autoWidth {...props} />

      <h5>自动宽度 & 圆角</h5>
      <PETable autoWidth round {...props} />

      <h5>自动宽度 & 圆角 & 加载中</h5>
      <PETable loading autoWidth {...props} round />

      <h5>自动宽度 & 圆角 & 空数据</h5>
      <PETable autoWidth {...props} dataSource={[]} round />

      <h5>自动宽度 & 圆角 & 合并单元格</h5>
      <PETable
        autoWidth
        round
        {...props}
        cellProps={(rowIndex, colIndex, dataIndex, record) => {
          if (record.name == "张三" && dataIndex == "name") {
            return { colSpan: 3 };
          }

          if (record.name == "王五" && dataIndex == "sex") {
            return { colSpan: 2, rowSpan: 2 };
          }
        }}
      />

      <h5>自动宽度 & 圆角 & 最大高度</h5>
      <PETable
        autoWidth
        round
        {...props}
        maxBodyHeight={200}
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
      />

      <h5>自动宽度 & 圆角 & 多表头</h5>
      <PETable
        autoWidth
        {...props}
        round
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
      />

      <h5> 圆角 & 冻结列</h5>
      <PETable
        round
        {...props}
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
      />

      <h5>圆角 & 冻结列 & 列宽调整</h5>
      <PETable
        round
        {...props}
        columns={resizeCols2}
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

          loop(resizeCols2);
          setResizeCols2([...resizeCols2]);
        }}
      />

      <br />

      <PETable
        {...props}
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

      <h5>自动宽度 & 圆角 & 树型</h5>
      <PETable
        round
        autoWidth
        isTree
        autoWidth
        round
        {...props}
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
      />

      <h5>圆角 & 冻结列 & 列宽调整 & 树型 & 异步</h5>
      <PETable
        isTree
        round
        {...props}
        columns={resizeCols3}
        onResizeChange={(colIndex, width) => {
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

          loop(resizeCols3);
          setResizeCols3([...resizeCols3]);
        }}
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
      />
    </div>
  );
};

ReactDOM.render(<App />, mountNode);
```
