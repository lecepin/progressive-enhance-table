import * as React from "react";
import * as classNames from "classnames";
import { debounce } from "lodash";
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
  useVirtual?: boolean;
  mergedCellsStick?: boolean;
  refDomTable?: React.MutableRefObject<HTMLDivElement | null>;
}

interface PositionForV {
  rIndex: number;
  top: number;
  bottom: number;
  height: number;
  primaryId: string;
}

interface SpanArea {
  renderContent: React.ReactNode;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export default React.memo(
  React.forwardRef(function Body(
    {
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
      useVirtual,
      mergedCellsStick,
      refDomTable,
    }: Props,
    ref
  ) {
    React.useImperativeHandle(ref, () => ({
      resizeForV,
      scrollForV,
      getPositionInfoByPrimaryId,
    }));

    const notRenderCellIndex: Array<Array<any>> = [];
    const domHeaderHeight =
      (
        refDomTable?.current?.querySelector(
          ":scope > .PE-header"
        ) as HTMLElement
      )?.getBoundingClientRect()?.height || 0;

    // ⬇⬇⬇ 虚拟滚动专用 ⬇⬇⬇
    const [visibleData, setVisibleData] = React.useState<Array<any>>([]);
    const positionforV = React.useRef<Array<PositionForV>>([]);
    const refPEBody = React.useRef<HTMLDivElement>(null);
    const refTbody = React.useRef<HTMLTableSectionElement>(null);
    const visibleCount = React.useRef<number>(0);
    const paddingTop = React.useRef<number>(0);
    // 用来判断方向
    const preScrollTop = React.useRef<number>(0);
    const startIndex = React.useRef<number>(0);
    const bufferCount = React.useRef<number>(1);
    const stylePeBody: React.CSSProperties = {};
    const resetEvent = React.useRef<any>(
      debounce(() => {
        refPEBody.current.classList.remove("PETable-no-event");
      }, 90)
    );
    const spanArea = React.useMemo(() => {
      const result: Array<SpanArea> = [];

      if (!useVirtual) {
        return [];
      }

      dataSource?.map((row, rowIndex) => {
        flatColumn?.map((col, colIndex) => {
          const attrs =
            cellProps?.(rowIndex, colIndex, col?.dataIndex, row) || {};

          if (attrs?.rowSpan > 1 || attrs?.colSpan > 1) {
            result.push({
              renderContent:
                typeof col?.cell === "function"
                  ? col?.cell(
                      col?.dataIndex ? row[col?.dataIndex] : undefined,
                      rowIndex,
                      row
                    )
                  : col?.dataIndex
                  ? row[col?.dataIndex]
                  : undefined,
              left: colIndex,
              right: colIndex + (attrs?.colSpan || 1),
              top: rowIndex,
              bottom: rowIndex + (attrs?.rowSpan || 1),
            });
          }
        });
      });

      return result;
    }, [dataSource, flatColumn, useVirtual]);

    let endIndex = 0;
    const resizeForV = (refPETable: HTMLElement) => {
      if (useVirtual) {
        const height =
          refPETable.getBoundingClientRect().height - domHeaderHeight;

        visibleCount.current = Math.ceil(height / rowHeight);
        endIndex = startIndex.current + visibleCount.current;

        updateVisibleDataAndLayout();
      }
    };
    const scrollForV = (refPETable: HTMLElement) => {
      refPEBody.current.classList.add("PETable-no-event");
      const binarySearch = (list: Array<any>, value: any) => {
        let start = 0;
        let end = list.length - 1;
        let tempIndex = null;

        while (start <= end) {
          let midIndex = ~~((start + end) / 2);
          let midValue = list[midIndex].bottom;

          // 刚好等于 current.buttom 时，则是 curent.index 的下一个，即 == (current.index + 1).top
          if (midValue === value) {
            return midIndex + 1;
          }
          // 不符合，继续找
          else if (midValue < value) {
            start = midIndex + 1;
          }
          // 打到了，但可能不是第一个
          else if (midValue > value) {
            // 所以要 继续往前找 找到第一个
            if (tempIndex === null || tempIndex > midIndex) {
              tempIndex = midIndex;
            }
            end = end - 1;
          }
        }

        resetEvent.current();

        return tempIndex;
      };

      // 通过 scrollTop，找到当前可视区域的第一条数据的位置信息
      // 条件是 scrollTop < current.bottom && scrollTop >= current.top

      startIndex.current = binarySearch(
        positionforV.current,
        refPETable.scrollTop
      );

      endIndex = startIndex.current + visibleCount.current;
      updateVisibleDataAndLayout();
    };
    const getPositionInfoByPrimaryId = (primaryId: string) => {
      return positionforV.current?.find?.(
        (item) => item.primaryId === primaryId
      );
    };
    const updateVisibleDataAndLayout = () => {
      // buffer 区域
      const bufferTop = dataSource.slice(
        startIndex.current - bufferCount.current,
        startIndex.current
      );
      const bufferBottom = dataSource.slice(
        endIndex,
        endIndex + bufferCount.current
      );

      // 合并 buffer 及可视区域的数据
      const visibleData = [
        ...bufferTop,
        ...dataSource.slice(startIndex.current, endIndex),
        ...bufferBottom,
      ];

      const _paddingTop = bufferTop.length
        ? positionforV.current[startIndex.current].top -
          positionforV.current[startIndex.current - 1].height
        : 0;

      // 优化。防止每次滚动都渲染
      if (paddingTop.current != _paddingTop || _paddingTop == 0) {
        paddingTop.current = _paddingTop;
        setVisibleData(visibleData);
      }
    };

    // 初始化位置信息
    React.useEffect(() => {
      if (useVirtual) {
        positionforV.current = dataSource.map((row, index) => {
          return {
            rIndex: index,
            top: index * rowHeight,
            bottom: (index + 1) * rowHeight,
            height: rowHeight,
            primaryId: row[primaryKey],
          };
        });
      }
    }, [dataSource, rowHeight, useVirtual]);

    // 获取实际 Row DOM 的高度
    React.useLayoutEffect(() => {
      if (useVirtual && refTbody.current?.children?.length) {
        const domTable = refDomTable?.current;

        if (!domTable) {
          return;
        }

        const isDirUp = domTable.scrollTop < preScrollTop.current;
        let isAdjusted = false;

        preScrollTop.current = domTable.scrollTop;
        Array.from(refTbody.current.children).forEach((item: HTMLElement) => {
          const index = +item.getAttribute("data-row-index");
          const height = item.offsetHeight;
          const oldHeight = positionforV.current[index].height;
          const diffHeight = height - oldHeight;

          if (diffHeight) {
            positionforV.current[index].height = height;
            positionforV.current[index].bottom += diffHeight;

            // 解决快速向下滚动，导致没有渲染，再次向上滚动时的抖动问题
            if (!isAdjusted && isDirUp) {
              isAdjusted = true;
              domTable.scrollTop += diffHeight;
            }

            // 更新后面的数据的位置信息
            for (let i = index + 1; i < positionforV.current.length; i++) {
              positionforV.current[i].top += diffHeight;
              positionforV.current[i].bottom += diffHeight;
            }
          }
        });
      }
    });

    if (useVirtual) {
      stylePeBody["height"] =
        positionforV.current[positionforV.current.length - 1]?.bottom || 0;
      stylePeBody["paddingTop"] = paddingTop.current;
    }

    // ⬆⬆⬆ 虚拟滚动专用 ⬆⬆⬆

    return (
      <div
        className={classNames("PE-Body", { "PE-Body-round": round })}
        style={stylePeBody}
        ref={refPEBody}
      >
        <table
          className={classNames("PE-Body-table", {
            "PE-Body-auto-width": autoWidth,
          })}
        >
          <ColGroup columns={flatColumn} autoWidth={autoWidth} />
          <tbody ref={refTbody}>
            {(useVirtual ? visibleData : dataSource)?.map(
              (row, rowIndex, arr) => {
                const rIndex = useVirtual
                  ? (startIndex.current - bufferCount.current < 0
                      ? 0
                      : startIndex.current - bufferCount.current) + rowIndex
                  : rowIndex;

                return (
                  <tr
                    key={rowIndex}
                    data-row-index={rIndex}
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
                        cellProps?.(rIndex, colIndex, col?.dataIndex, row) ||
                        {};
                      let renderContent =
                        typeof col?.cell === "function"
                          ? col?.cell(
                              col?.dataIndex ? row[col?.dataIndex] : undefined,
                              rowIndex,
                              row
                            )
                          : col?.dataIndex
                          ? row[col?.dataIndex]
                          : undefined;

                      // 动态调整虚拟滚动下的合并单元格情况
                      if (useVirtual) {
                        const spanInfo = spanArea?.find(
                          ({ left, right, bottom, top }) => {
                            if (
                              left <= colIndex &&
                              colIndex < right &&
                              top <= rIndex &&
                              rIndex < bottom
                            ) {
                              return true;
                            }

                            return false;
                          }
                        );

                        if (spanInfo) {
                          attrs.rowSpan = Math.min(
                            spanInfo.bottom - rIndex,
                            visibleData.length
                          );
                          attrs.colSpan = spanInfo.right - colIndex;
                          renderContent = spanInfo.renderContent;
                        }
                      }

                      // 下面这种合并方法虽然会多一个当前的进去，但再下次渲染的时候，会清空掉，也还好
                      if (attrs.colSpan > 1 || attrs.rowSpan > 1) {
                        for (let i = 0; i < (attrs.colSpan ?? 1); i++) {
                          for (let j = 0; j < (attrs.rowSpan ?? 1); j++) {
                            notRenderCellIndex.push([
                              rowIndex + j,
                              colIndex + i,
                            ]);
                          }
                        }

                        if (mergedCellsStick) {
                          renderContent = (
                            <div
                              className="PE-Body-cell-merged-stick-to-top"
                              style={{
                                top: domHeaderHeight,
                                bottom: 0,
                              }}
                            >
                              {renderContent}
                            </div>
                          );
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
                          colIndex >=
                            flatColumn.length - lockRightColumns.length
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
                              colIndex >=
                                flatColumn.length - lockRightColumns.length,
                          })}
                          style={{
                            ...(attrs?.style || {}),
                            textAlign: col?.align,
                            ...lockStyle,
                          }}
                        >
                          {renderContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              }
            )}
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
  })
);
