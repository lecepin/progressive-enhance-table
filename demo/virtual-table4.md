---
title: 虚拟表格-定高合并单元格冻结
order: 43
---

```jsx
import React from "react";
import ReactDOM from "react-dom";
import PETable from "pe-table";

const App = () => {
  const columns = [...new Array(30)].map((item, index, arr) => ({
    dataIndex: "" + (index + 1),
    title: "列" + (index + 1),
    width: 100,
    align: "center",
    alignHeader: "center",
    lock: index < 2 ? "left" : index >= arr.length - 2 ? "right" : false,
  }));

  const dataSource = [...new Array(1000)].map((item, rindex) => {
    const rowData = { id: rindex };
    const h = Math.random() * 80 + 40;
    columns.map((item, colindex) => {
      rowData[item.dataIndex] = (
        <div
          style={
            {
              // height: h,
            }
          }
        >{`${rindex + 1}行${colindex + 1}列`}</div>
      );
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
