import * as React from "react";
import { ColumnProps } from "./../interface";

interface Props {
  columns: ColumnProps[];
  autoWidth?: boolean;
}

export default React.memo(function ColGroup({
  columns,
  autoWidth = false,
}: Props) {
  return (
    <colgroup>
      {columns.map((col, index) => (
        <col
          style={{
            width: col?.width,
            minWidth: autoWidth ? "unset" : col?.width,
          }}
          key={index}
        ></col>
      ))}
    </colgroup>
  );
});
