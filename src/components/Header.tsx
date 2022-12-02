import * as React from "react";
import * as classNames from "classnames";
import ColGroup from "./ColGroup";
import Resize from "./Resize";
import { ColumnProps } from "./../interface";

import "./Header.less";

interface GroupColumnProps extends ColumnProps {
  colSpan?: number;
  rowSpan?: number;
}
interface Props {
  columns?: ColumnProps[];
  autoWidth?: boolean;
  round?: boolean;
  flatColumn: ColumnProps[];
  groupColumn: Array<Array<GroupColumnProps>>;
  lockLeftColumns?: ColumnProps[];
  lockRightColumns?: ColumnProps[];
  refDomResizeBar?: React.MutableRefObject<HTMLDivElement | null>;
  refDomTable?: React.MutableRefObject<HTMLDivElement | null>;
  onResizeChange?: (dataIndex: string, value: number) => void;
}

export default React.memo(function Header({
  flatColumn = [],
  groupColumn,
  autoWidth,
  round,
  lockLeftColumns = [],
  lockRightColumns = [],
  refDomResizeBar,
  refDomTable,
  onResizeChange,
}: Props) {
  return (
    <div
      className={classNames("PE-header", {
        "PE-header-round": round,
      })}
    >
      <table
        className={classNames("PE-header-table", {
          "PE-header-auto-width": autoWidth,
        })}
      >
        <ColGroup columns={flatColumn} autoWidth={autoWidth} />
        <thead>
          {groupColumn?.map?.((groupChild, index, arr) => (
            <tr
              key={index}
              className={classNames("PE-header-row", {
                "PE-header-row-first": index == 0,
                "PE-header-row-last": index == arr.length - 1,
              })}
            >
              {groupChild.map((col, index, arr) => {
                const lockStyle: React.CSSProperties = {};

                if (!autoWidth) {
                  if (
                    lockLeftColumns?.length &&
                    index < lockLeftColumns.length
                  ) {
                    lockStyle.position = "sticky";
                    lockStyle.left = lockLeftColumns
                      .slice(0, index)
                      .reduce((pre, cur) => pre + (cur?.width ?? 0), 0);
                  } else if (
                    lockRightColumns?.length &&
                    index >= flatColumn.length - lockRightColumns.length
                  ) {
                    lockStyle.position = "sticky";
                    lockStyle.right = lockRightColumns
                      .slice(
                        index - flatColumn.length + lockRightColumns.length + 1
                      )
                      .reduce((pre, cur) => pre + (cur?.width ?? 0), 0);
                  }
                }

                return (
                  <th
                    key={index}
                    colSpan={col?.colSpan}
                    rowSpan={col?.rowSpan}
                    className={classNames("PE-header-col", {
                      "PE-header-col-first": index == 0,
                      "PE-header-col-last": index == arr.length - 1,
                      "PE-header-col-lock-left":
                        !autoWidth && index < lockLeftColumns.length,
                      "PE-header-col-lock-right":
                        !autoWidth &&
                        index >= flatColumn.length - lockRightColumns.length,
                    })}
                    style={{
                      textAlign: col?.alignHeader,
                      ...lockStyle,
                    }}
                  >
                    {typeof col?.title === "function"
                      ? col?.title()
                      : col?.title}

                    {col?.colSpan === 1 && col?.resizable ? (
                      <Resize
                        refDomResizeBar={refDomResizeBar}
                        refDomTable={refDomTable}
                        col={col}
                        onResizeChange={onResizeChange}
                      />
                    ) : null}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
      </table>
    </div>
  );
});
