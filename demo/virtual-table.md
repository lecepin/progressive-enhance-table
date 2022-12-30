---
title: 虚拟表格-定高
order: 40
---

定高，普通表格。

配合设置 `useVirtual: true` 和 `maxHeight: 500` 属性。

```jsx
import React from "react";
import ReactDOM from "react-dom";
import PETable from "pe-table";

const App = () => {
  const columns = [...new Array(15)].map((item, index) => ({
    dataIndex: "" + (index + 1),
    title: "列" + (index + 1),
    width: 100,
    align: "center",
    alignHeader: "center",
  }));

  const dataSource = [...new Array(1000)].map((item, rindex) => {
    const rowData = { id: rindex };

    columns.map((item, colindex) => {
      rowData[item.dataIndex] = <div>{`${rindex + 1}行${colindex + 1}列`}</div>;
    });

    return rowData;
  });

  return (
    <div>
      <PETable
        round
        dataSource={dataSource}
        columns={columns}
        maxHeight={500}
        useVirtual
      />
    </div>
  );
};

ReactDOM.render(<App />, mountNode);
```
