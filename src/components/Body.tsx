import * as React from "react";
import * as classNames from "classnames";
import { debounce, cloneDeep } from "lodash";
import { getReactPropsFromDOM } from "./../utils";
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
  canDragRow?: boolean;
  dragRowSlot?: React.ReactNode;
  onDragRowEnd?: (dragRowNode: any, dropRowNode: any, dropPos: string) => void;
  onDragRowIsAvailable?: (dragRowNode: any, dropRowNode: any) => boolean;
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

const iconDragRow = (
  <svg
    width="15px"
    height="15px"
    viewBox="0 0 15 15"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g transform="translate(-270.000000, -222.000000)" fill-rule="nonzero">
        <g transform="translate(270.000000, 222.000000)">
          <rect
            fill="#000000"
            opacity="0"
            x="0"
            y="0"
            width="15"
            height="15"
          ></rect>
          <path
            d="M4.56521739,3.26596469 C4.56521739,3.55903412 4.72156807,3.82984144 4.97537364,3.97637616 C5.22917921,4.12291088 5.54188057,4.12291088 5.79568614,3.97637616 C6.04949172,3.82984144 6.20584239,3.55903412 6.20584239,3.26596469 C6.20584239,2.97289525 6.04949172,2.70208793 5.79568614,2.55555321 C5.54188057,2.40901849 5.22917921,2.40901849 4.97537364,2.55555321 C4.72156807,2.70208793 4.56521739,2.97289525 4.56521739,3.26596469 L4.56521739,3.26596469 Z M8.64130435,3.26596469 C8.64130435,3.55903412 8.79765502,3.82984144 9.05146059,3.97637616 C9.30526617,4.12291088 9.61796753,4.12291088 9.8717731,3.97637616 C10.1255787,3.82984144 10.2819293,3.55903412 10.2819293,3.26596469 C10.2819293,2.97289525 10.1255787,2.70208793 9.8717731,2.55555321 C9.61796753,2.40901849 9.30526617,2.40901849 9.05146059,2.55555321 C8.79765502,2.70208793 8.64130435,2.97289525 8.64130435,3.26596469 L8.64130435,3.26596469 Z M4.56521739,6.03940219 C4.56521739,6.33247162 4.72156807,6.60327894 4.97537364,6.74981366 C5.22917921,6.89634838 5.54188057,6.89634838 5.79568614,6.74981366 C6.04949172,6.60327894 6.20584239,6.33247162 6.20584239,6.03940219 C6.20584239,5.74633275 6.04949172,5.47552543 5.79568614,5.32899071 C5.54188057,5.18245599 5.22917921,5.18245599 4.97537364,5.32899071 C4.72156807,5.47552543 4.56521739,5.74633275 4.56521739,6.03940219 L4.56521739,6.03940219 Z M4.56521739,8.81283969 C4.56521739,9.10590912 4.72156807,9.37671644 4.97537364,9.52325116 C5.22917921,9.66978588 5.54188057,9.66978588 5.79568614,9.52325116 C6.04949172,9.37671644 6.20584239,9.10590912 6.20584239,8.81283969 C6.20584239,8.51977025 6.04949172,8.24896293 5.79568614,8.10242821 C5.54188057,7.95589349 5.22917921,7.95589349 4.97537364,8.10242821 C4.72156807,8.24896293 4.56521739,8.51977025 4.56521739,8.81283969 L4.56521739,8.81283969 Z M8.64130435,6.03940219 C8.64130435,6.33247162 8.79765502,6.60327894 9.05146059,6.74981366 C9.30526617,6.89634838 9.61796753,6.89634838 9.8717731,6.74981366 C10.1255787,6.60327894 10.2819293,6.33247162 10.2819293,6.03940219 C10.2819293,5.74633275 10.1255787,5.47552543 9.8717731,5.32899071 C9.61796753,5.18245599 9.30526617,5.18245599 9.05146059,5.32899071 C8.79765502,5.47552543 8.64130435,5.74633275 8.64130435,6.03940219 L8.64130435,6.03940219 Z M4.56521739,11.5862772 C4.56521739,11.8793466 4.72156807,12.1501539 4.97537364,12.2966887 C5.22917921,12.4432234 5.54188057,12.4432234 5.79568614,12.2966887 C6.04949172,12.1501539 6.20584239,11.8793466 6.20584239,11.5862772 C6.20584239,11.2932078 6.04949172,11.0224004 5.79568614,10.8758657 C5.54188057,10.729331 5.22917921,10.729331 4.97537364,10.8758657 C4.72156807,11.0224004 4.56521739,11.2932078 4.56521739,11.5862772 L4.56521739,11.5862772 Z M8.64130435,11.5862772 C8.64130435,11.8793466 8.79765502,12.1501539 9.05146059,12.2966887 C9.30526617,12.4432234 9.61796753,12.4432234 9.8717731,12.2966887 C10.1255787,12.1501539 10.2819293,11.8793466 10.2819293,11.5862772 C10.2819293,11.2932078 10.1255787,11.0224004 9.8717731,10.8758657 C9.61796753,10.729331 9.30526617,10.729331 9.05146059,10.8758657 C8.79765502,11.0224004 8.64130435,11.2932078 8.64130435,11.5862772 L8.64130435,11.5862772 Z M8.64130435,8.81283969 C8.64130435,9.10590912 8.79765502,9.37671644 9.05146059,9.52325116 C9.30526617,9.66978588 9.61796753,9.66978588 9.8717731,9.52325116 C10.1255787,9.37671644 10.2819293,9.10590912 10.2819293,8.81283969 C10.2819293,8.51977025 10.1255787,8.24896293 9.8717731,8.10242821 C9.61796753,7.95589349 9.30526617,7.95589349 9.05146059,8.10242821 C8.79765502,8.24896293 8.64130435,8.51977025 8.64130435,8.81283969 L8.64130435,8.81283969 Z"
            fill-opacity="0.4"
            fill="#1F3858"
          ></path>
        </g>
      </g>
    </g>
  </svg>
);

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
      canDragRow,
      dragRowSlot,
      onDragRowEnd,
      onDragRowIsAvailable,
    }: Props,
    ref
  ) {
    React.useImperativeHandle(ref, () => ({
      resizeForV,
      scrollForV,
      getPositionInfoByPrimaryId,
      delRow,
    }));

    const notRenderCellIndex: Array<Array<any>> = [];
    const domHeaderHeight =
      (
        refDomTable?.current?.querySelector(
          ":scope > .PE-header"
        ) as HTMLElement
      )?.getBoundingClientRect()?.height || 0;

    const dragStartEl = React.useRef<HTMLElement>(null);
    const dragNextEl = React.useRef<HTMLElement>(null);
    const dragNextPos = React.useRef<string>(null);

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
    const resizeForV = (refPETable: HTMLElement, forceRender = false) => {
      if (!refPETable) return;
      if (useVirtual) {
        const height =
          refPETable.getBoundingClientRect().height - domHeaderHeight;

        visibleCount.current = Math.ceil(height / rowHeight);
        endIndex = startIndex.current + visibleCount.current;

        updateVisibleDataAndLayout(forceRender);
      }
    };
    const scrollForV = (refPETable: HTMLElement) => {
      if (!refPETable) return;

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
    const updateVisibleDataAndLayout = (forceRender = false) => {
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
      if (
        paddingTop.current != _paddingTop ||
        _paddingTop == 0 ||
        forceRender
      ) {
        paddingTop.current = _paddingTop;
        setVisibleData(visibleData);
      }
    };
    const delRow = (primaryId: string) => {
      // 删除数组项目
      const index = positionforV.current.findIndex(
        (item) => item.primaryId === primaryId
      );

      if (index > -1) {
        // 更新后面的数据的位置信息
        for (let i = index + 1; i < positionforV.current.length; i++) {
          if (i === index + 1) {
            positionforV.current[i].top = positionforV.current[i - 1].top;
          } else {
            positionforV.current[i].top = positionforV.current[i - 1].bottom;
          }

          positionforV.current[i].bottom =
            positionforV.current[i].top + positionforV.current[i].height;
        }

        positionforV.current.splice(index, 1);
        resizeForV(refDomTable.current, true);
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
        positionforV.current[positionforV.current.length - 1]?.bottom ||
        "unset";
      stylePeBody["paddingTop"] = paddingTop.current;
    }

    // ⬆⬆⬆ 虚拟滚动专用 ⬆⬆⬆

    return (
      <div
        className={classNames("PE-Body", { "PE-Body-round": round })}
        style={stylePeBody}
        ref={refPEBody}
        onDragStart={(e) => {
          if (!canDragRow) {
            return;
          }
          const rowDOM: HTMLElement = (e.target as HTMLElement)?.closest?.(
            ".PE-Body-row"
          );

          if (!rowDOM) {
            return;
          }

          dragStartEl.current = rowDOM;
          e.dataTransfer.setDragImage(rowDOM, 0, rowDOM.offsetHeight / 2);
        }}
        onDragOver={(e) => {
          if (!canDragRow) {
            return;
          }
          e.preventDefault();
          const rowDOM: HTMLElement = (e.target as HTMLElement)?.closest?.(
            ".PE-Body-row"
          );
          const lineDOM: HTMLElement = document.querySelector(
            ".PETable-drag-row-line"
          );

          if (!lineDOM) {
            return;
          }

          if (!rowDOM) {
            lineDOM.style.display = "none";
            return;
          }

          if (
            onDragRowIsAvailable &&
            dragNextEl.current != rowDOM &&
            dragStartEl.current != rowDOM
          ) {
            dragNextEl.current != rowDOM;
            const isAvailable = onDragRowIsAvailable(
              cloneDeep(getReactPropsFromDOM(dragStartEl.current, "data-raw")),
              cloneDeep(getReactPropsFromDOM(rowDOM, "data-raw"))
            );
            if (!isAvailable) {
              return;
            }
          }

          dragNextEl.current = rowDOM;

          const table = rowDOM.closest("table");
          const { y: rowDOMY, height: rowDOMH } =
            rowDOM.getBoundingClientRect();
          const centerY = rowDOMY + rowDOMH / 2;

          lineDOM.style.display = "block";
          lineDOM.style.left = table.getBoundingClientRect().x + "px";
          lineDOM.style.width = table.getBoundingClientRect().width + "px";

          if (e.clientY > centerY || rowDOM === dragStartEl.current) {
            lineDOM.style.top = rowDOMY + rowDOMH + "px";
            dragNextPos.current = "bottom";
          } else {
            lineDOM.style.top = rowDOMY + "px";
            dragNextPos.current = "top";
          }

          lineDOM.style.display = "block";
        }}
        onDragEnter={(e) => {}}
        onDragEnd={(e) => {
          if (!canDragRow) {
            return;
          }
          
          const lineDOM: HTMLElement = document.querySelector(
            ".PETable-drag-row-line"
          );
          if (!lineDOM) {
            return;
          }
          lineDOM.style.display = "none";

          dragStartEl.current != dragNextEl.current &&
            onDragRowEnd?.(
              cloneDeep(getReactPropsFromDOM(dragStartEl.current, "data-raw")),
              cloneDeep(getReactPropsFromDOM(dragNextEl.current, "data-raw")),
              dragNextPos.current
            );
        }}
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
                    data-raw={row}
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
                          {colIndex === 0 &&
                          canDragRow &&
                          row?.isCanDrag !== false ? (
                            <div
                              className="PE-Body-drag-row"
                              draggable={
                                canDragRow && row?.isCanDrag !== false
                                  ? "true"
                                  : "false"
                              }
                              style={{ float: "left" }}
                            >
                              {dragRowSlot ?? iconDragRow}
                            </div>
                          ) : null}
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
