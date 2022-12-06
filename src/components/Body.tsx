import * as React from "react";
import * as classNames from "classnames";
import ColGroup from "./ColGroup";
import { ColumnProps } from "./../interface";

import "./Body.less";

interface Props {
  columns?: ColumnProps[];
  lockLeftColumns?: ColumnProps[];
  lockRightColumns?: ColumnProps[];
  dataSource: Array<any>;
  flatColumn?: ColumnProps[];
  emptyContent?: React.ReactNode;
  autoWidth?: boolean;
  round?: boolean;
  loading?: boolean;
  cellProps?: (
    rowIndex: number,
    colIndex: number,
    dataIndex: string,
    record: any
  ) => any;
  rowHeight?: number;
  primaryKey?: string;
}

export default React.memo(function Body({
  dataSource,
  flatColumn = [],
  emptyContent,
  autoWidth,
  round,
  loading,
  cellProps,
  lockLeftColumns = [],
  lockRightColumns = [],
  primaryKey,
  rowHeight,
}: Props) {
  const notRenderCellIndex: Array<Array<any>> = [];

  return (
    <div className={classNames("PE-Body", { "PE-Body-round": round })}>
      <table
        className={classNames("PE-Body-table", {
          "PE-Body-auto-width": autoWidth,
        })}
      >
        <ColGroup columns={flatColumn} autoWidth={autoWidth} />
        <tbody>
          {dataSource?.map((row, rowIndex, arr) => (
            <tr
              key={rowIndex}
              data-row-index={rowIndex}
              className={classNames("PE-Body-row", {
                "PE-Body-row-first": rowIndex == 0,
                "PE-Body-row-last": rowIndex == arr.length - 1,
              })}
              data-primary-id={row[primaryKey]}
              style={{ height: rowHeight }}
            >
              {flatColumn?.map((col, colIndex, arr) => {
                // 合并单元格处理
                const matchCellIndex = notRenderCellIndex
                  .map((cellIndex) => cellIndex.toString())
                  .indexOf([rowIndex, colIndex].toString());
                const lockStyle: React.CSSProperties = {};

                if (matchCellIndex > -1) {
                  // 此处删不删数组中的项，其实无所谓
                  notRenderCellIndex.splice(matchCellIndex, 1);
                  return null;
                }

                const attrs =
                  cellProps?.(rowIndex, colIndex, col?.dataIndex, row) || {};

                // 下面这种合并方法虽然会多一个当前的进去，但再下次渲染的时候，会清空掉，也还好
                if (attrs.colSpan > 1 || attrs.rowSpan > 1) {
                  for (let i = 0; i < (attrs.colSpan ?? 1); i++) {
                    for (let j = 0; j < (attrs.rowSpan ?? 1); j++) {
                      notRenderCellIndex.push([rowIndex + j, colIndex + i]);
                    }
                  }
                }

                if (!autoWidth) {
                  if (
                    lockLeftColumns?.length &&
                    colIndex < lockLeftColumns.length
                  ) {
                    lockStyle.position = "sticky";
                    lockStyle.left = lockLeftColumns
                      .slice(0, colIndex)
                      .reduce((pre, cur) => pre + (cur?.width ?? 0), 0);
                  } else if (
                    lockRightColumns?.length &&
                    colIndex >= flatColumn.length - lockRightColumns.length
                  ) {
                    lockStyle.position = "sticky";
                    lockStyle.right = lockRightColumns
                      .slice(
                        colIndex -
                          flatColumn.length +
                          lockRightColumns.length +
                          1
                      )
                      .reduce((pre, cur) => pre + (cur?.width ?? 0), 0);
                  }
                }

                return (
                  <td
                    {...attrs}
                    key={colIndex}
                    data-row-index={rowIndex}
                    data-col-index={colIndex}
                    className={classNames("PE-Body-col", {
                      "PE-Body-col-first": colIndex == 0,
                      "PE-Body-col-last": colIndex == arr.length - 1,
                      "PE-Body-col-lock-left":
                        !autoWidth && colIndex < lockLeftColumns.length,
                      "PE-Body-col-lock-right":
                        !autoWidth &&
                        colIndex >= flatColumn.length - lockRightColumns.length,
                    })}
                    style={{
                      ...(attrs?.style || {}),
                      textAlign: col?.align,
                      ...lockStyle,
                    }}
                  >
                    {typeof col?.cell === "function"
                      ? col?.cell(
                          col?.dataIndex ? row[col?.dataIndex] : undefined,
                          rowIndex,
                          row
                        )
                      : col?.dataIndex
                      ? row[col?.dataIndex]
                      : undefined}
                  </td>
                );
              })}
            </tr>
          ))}
          {!dataSource?.length && !loading ? (
            <tr>
              <td className="PE-Body-empty" colSpan={flatColumn.length}>
                {emptyContent ?? "没有数据"}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
});
