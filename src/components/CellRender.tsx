import * as React from "react";
import { ColumnProps } from "./../interface";

interface Props {
  col: ColumnProps;
  row: any;
  rowIndex?: number;
}

export default React.memo(function PECellRender({ col, row, rowIndex }: Props) {
  return (
    <>
      {typeof col?.cell === "function"
        ? col?.cell(
            col?.dataIndex ? row[col?.dataIndex] : undefined,
            rowIndex,
            row
          )
        : col?.dataIndex
        ? row[col?.dataIndex]
        : undefined}
    </>
  );
});
