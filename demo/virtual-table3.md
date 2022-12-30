---
title: 虚拟表格-定高合并单元格
order: 42
---

配合 `mergedCellsStickToTop: true` 可以实现，合并单元格滚动屏幕外时，粘在顶部。

不定高场景，同理。

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
        mergedCellsStickToTop
        cellProps={(rowIndex, colIndex, dataIndex, record) => {
          if (rowIndex == 0 && colIndex == 0) {
            return { rowSpan: 4 };
          }
          if (rowIndex == 4 && colIndex == 3) {
            return { rowSpan: 20, colSpan: 2 };
          }
        }}
      />
    </div>
  );
};

ReactDOM.render(<App />, mountNode);
```
