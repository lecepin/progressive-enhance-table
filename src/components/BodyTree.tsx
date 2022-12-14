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
  openRowKeys?: Array<any>;
  defaultOpenRowKeys?: Array<any>;

  loadData?: (record: any) => Promise<any>;
  indent?: number;
  primaryKey?: string;
  onRowOpen?: (
    openRowKeys: Array<any>,
    currentRowKey: string,
    expanded: boolean,
    currentRecord: any
  ) => void;
  isTreeGroupView?: boolean;
}

interface TreeNodeHandleParams {
  record: any;
  primaryKey: string;
  dataSource: Array<any>;
  openRowKeys: Array<any>;
  e?: MouseEvent;
}

const iconFold = (
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="6777"
    width="128"
    height="128"
  >
    <path
      d="M593.450667 512.128L360.064 278.613333l45.290667-45.226666 278.613333 278.762666L405.333333 790.613333l-45.226666-45.269333z"
      p-id="6778"
    ></path>
  </svg>
);
const iconExpand = (
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="6931"
    width="128"
    height="128"
  >
    <path
      d="M500.8 604.779L267.307 371.392l-45.227 45.27 278.741 278.613L779.307 416.66l-45.248-45.248z"
      p-id="6932"
    ></path>
  </svg>
);

const iconLoading = (
  <svg
    className="PE-Body-Tree-loading-icon"
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
    width="128"
    height="128"
  >
    <path
      d="M876.864 782.592c3.264 0 6.272-3.2 6.272-6.656 0-3.456-3.008-6.592-6.272-6.592-3.264 0-6.272 3.2-6.272 6.592 0 3.456 3.008 6.656 6.272 6.656zM736.32 935.936c2.304 2.432 5.568 3.84 8.768 3.84a12.16 12.16 0 0 0 8.832-3.84 13.76 13.76 0 0 0 0-18.56 12.224 12.224 0 0 0-8.832-3.84 12.16 12.16 0 0 0-8.768 3.84 13.696 13.696 0 0 0 0 18.56zm-184 82.304c3.456 3.648 8.32 5.76 13.184 5.76a18.368 18.368 0 0 0 13.184-5.76 20.608 20.608 0 0 0 0-27.968 18.368 18.368 0 0 0-13.184-5.824 18.368 18.368 0 0 0-13.184 5.76 20.608 20.608 0 0 0 0 28.032zm-198.336-5.76c4.608 4.8 11.072 7.68 17.6 7.68a24.448 24.448 0 0 0 17.536-7.68 27.456 27.456 0 0 0 0-37.248 24.448 24.448 0 0 0-17.536-7.68 24.448 24.448 0 0 0-17.6 7.68 27.52 27.52 0 0 0 0 37.184zm-175.68-91.84c5.76 6.08 13.824 9.6 21.952 9.6a30.592 30.592 0 0 0 22.016-9.6 34.368 34.368 0 0 0 0-46.592 30.592 30.592 0 0 0-22.016-9.6 30.592 30.592 0 0 0-21.952 9.6 34.368 34.368 0 0 0 0 46.592zM57.152 761.28c6.912 7.36 16.64 11.648 26.368 11.648a36.736 36.736 0 0 0 26.432-11.584 41.28 41.28 0 0 0 0-55.936 36.736 36.736 0 0 0-26.432-11.584 36.8 36.8 0 0 0-26.368 11.52 41.28 41.28 0 0 0 0 56zM12.736 564.672a42.88 42.88 0 0 0 30.784 13.44 42.88 42.88 0 0 0 30.784-13.44 48.128 48.128 0 0 0 0-65.216 42.88 42.88 0 0 0-30.72-13.44 42.88 42.88 0 0 0-30.848 13.44 48.128 48.128 0 0 0 0 65.216zM52.544 369.28a48.96 48.96 0 0 0 35.2 15.36 48.96 48.96 0 0 0 35.2-15.36 54.976 54.976 0 0 0 0-74.56 48.96 48.96 0 0 0-35.2-15.424 48.96 48.96 0 0 0-35.2 15.424 54.976 54.976 0 0 0 0 74.56zm115.776-156.8c10.368 11.008 24.96 17.408 39.68 17.408 14.592 0 29.184-6.4 39.552-17.408a61.888 61.888 0 0 0 0-83.84 55.104 55.104 0 0 0-39.616-17.408c-14.656 0-29.248 6.4-39.616 17.408a61.888 61.888 0 0 0 0 83.84zm169.024-87.68c11.52 12.16 27.712 19.264 43.968 19.264 16.256 0 32.448-7.04 43.968-19.264a68.672 68.672 0 0 0 0-93.184 61.248 61.248 0 0 0-43.968-19.264 61.248 61.248 0 0 0-43.968 19.264 68.736 68.736 0 0 0 0 93.184zm189.632-1.088c12.672 13.44 30.528 21.248 48.448 21.248s35.712-7.808 48.384-21.248a75.584 75.584 0 0 0 0-102.464A67.392 67.392 0 0 0 575.36 0c-17.92 0-35.776 7.808-48.448 21.248a75.584 75.584 0 0 0 0 102.464zM700.8 210.304c13.824 14.592 33.28 23.104 52.736 23.104 19.584 0 39.04-8.512 52.8-23.104a82.432 82.432 0 0 0 0-111.744 73.472 73.472 0 0 0-52.8-23.168c-19.52 0-38.912 8.512-52.736 23.168a82.432 82.432 0 0 0 0 111.744zm124.032 158.528c14.976 15.872 36.032 25.088 57.216 25.088 21.12 0 42.24-9.216 57.152-25.088a89.344 89.344 0 0 0 0-121.088 79.616 79.616 0 0 0-57.152-25.088c-21.184 0-42.24 9.216-57.216 25.088a89.344 89.344 0 0 0 0 121.088zm50.432 204.032c16.128 17.088 38.784 27.008 61.632 27.008 22.784 0 45.44-9.92 61.568-27.008a96.256 96.256 0 0 0 0-130.432 85.76 85.76 0 0 0-61.568-27.072c-22.848 0-45.44 9.984-61.632 27.072a96.192 96.192 0 0 0 0 130.432z"
      fill="#262626"
    />
  </svg>
);

export default React.memo(function BodyTree({
  dataSource,
  flatColumn = [],
  emptyContent,
  autoWidth,
  round,
  loading,
  cellProps,
  lockLeftColumns = [],
  lockRightColumns = [],
  openRowKeys: propOpenRowKeys,
  defaultOpenRowKeys = [],
  loadData,
  indent = 20,
  primaryKey,
  onRowOpen,
  isTreeGroupView,
  rowHeight,
}: Props) {
  const [openRowKeys, setOpenRowKeys] = React.useState(defaultOpenRowKeys);
  const [loadingKeys, setLoadingKeys] = React.useState([]);

  React.useEffect(() => {
    propOpenRowKeys && setOpenRowKeys(propOpenRowKeys);
  }, [propOpenRowKeys]);

  // ???????????? DS
  const flatDataSource = React.useMemo(() => {
    const ret: Array<any> = [];
    const loop = (dataSource: Array<any>, level: number) => {
      dataSource.forEach((item) => {
        ret.push({ ...item, ___level: level });

        if (item.children) {
          loop(item.children, level + 1);
        }
      });
    };

    loop(dataSource, 0);
    return ret;
  }, [dataSource, primaryKey]);

  // ?????????????????? dataSoure ??? openRowKeys?????????????????????????????? ????????????
  const showTreeNodes = React.useMemo(() => {
    const ret: Array<any> = [];

    openRowKeys.forEach((openKey) => {
      flatDataSource.forEach((item) => {
        if (item[primaryKey] === openKey) {
          if (item.children) {
            item.children.forEach((child: any) => {
              ret.push(child[primaryKey]);
            });
          }
        }
      });
    });
    return ret;
  }, [flatDataSource, openRowKeys, primaryKey]);

  const onTreeNodeClick = (params: TreeNodeHandleParams) => {
    const { record, primaryKey, dataSource, openRowKeys, e } = params;
    const id = record[primaryKey];
    const index = openRowKeys.indexOf(id);

    // ???????????????????????????????????????????????????????????????????????????
    const getChildrenKeyById = function (id: any) {
      const ret = [id];
      const loop = (data: Array<any>) => {
        data.forEach((item) => {
          ret.push(item[primaryKey]);
          if (item.children) {
            loop(item.children);
          }
        });
      };
      dataSource.forEach((item) => {
        if (item[primaryKey] === id) {
          if (item.children) {
            loop(item.children);
          }
        }
      });
      return ret;
    };

    if (index > -1) {
      const ids = getChildrenKeyById(id);

      // ????????????????????????????????????????????????????????????????????????
      ids.forEach((id) => {
        const i = openRowKeys.indexOf(id);
        if (i > -1) {
          openRowKeys.splice(i, 1);
        }
      });
    } else {
      openRowKeys.push(id);
    }

    // ?????????????????? props???????????????????????? state
    if (!propOpenRowKeys) {
      setOpenRowKeys([...openRowKeys]);
    }

    // ???????????? openRowKeys?????????????????? id????????? true ?????? false???record
    onRowOpen?.(openRowKeys, id, index === -1, record);

    // ????????? loadData???????????????????????????????????????????????????
    if (
      index === -1 &&
      loadData &&
      !loadingKeys.includes(id) &&
      !record?.children?.length
    ) {
      setLoadingKeys([...loadingKeys, id]);

      loadData(record)
        .then(() => {
          setLoadingKeys((loadingKeys) =>
            loadingKeys.filter((key) => key !== id)
          );
        })
        .catch((e) => {
          setLoadingKeys((loadingKeys) =>
            loadingKeys.filter((key) => key !== id)
          );

          // ??????????????????
          if (!propOpenRowKeys) {
            setOpenRowKeys((openRowKeys) => {
              const newKeys = openRowKeys.filter((key) => key !== id);

              onRowOpen?.(newKeys, id, index === -1, record);

              return newKeys;
            });
          } else {
            const newKeys = propOpenRowKeys.filter((key) => key !== id);

            onRowOpen?.(newKeys, id, index === -1, record);
          }
        });
    }
  };

  const renderTable = () => {
    let tableArr: Array<Array<any>> = [];
    let tableIndex = -1;
    const notRenderCellIndex: Array<Array<any>> = [];

    flatDataSource?.map((row, rowIndex, arr) => {
      const isOpen = openRowKeys.includes(row[primaryKey]);
      const isLoading = loadingKeys.includes(row[primaryKey]);
      const isShow =
        row.___level === 0 || showTreeNodes.includes(row[primaryKey]);

      const renderTr = isShow ? (
        <tr
          key={rowIndex}
          data-row-index={rowIndex}
          className={classNames("PE-Body-row", {
            "PE-Body-row-first": rowIndex == 0,
            "PE-Body-row-last": rowIndex == arr.length - 1,
            "PE-Body-Tree-group-view-row-parent":
              row.___level === 0 && isTreeGroupView,
            "PE-Body-Tree-group-view-row-parent-round":
              row.___level === 0 && isTreeGroupView && round,
          })}
          data-primary-id={row[primaryKey]}
          style={{ height: rowHeight }}
        >
          {flatColumn?.map((col, colIndex, arr) => {
            const lockStyle: React.CSSProperties = {};
            // ?????????????????????
            const matchCellIndex = notRenderCellIndex
              .map((cellIndex) => cellIndex.toString())
              .indexOf([rowIndex, colIndex].toString());

            if (matchCellIndex > -1) {
              // ????????????????????????????????????????????????
              notRenderCellIndex.splice(matchCellIndex, 1);
              return null;
            }

            const attrs =
              cellProps?.(rowIndex, colIndex, col?.dataIndex, row) || {};

            // warning: tree ?????????????????????
            // ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
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
                    colIndex - flatColumn.length + lockRightColumns.length + 1
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
                <div
                  className={classNames({
                    "PE-Body-Tree-col": colIndex === 0,
                  })}
                >
                  {colIndex === 0 ? (
                    <div
                      className="PE-Body-Tree-arrow"
                      style={{ paddingLeft: row?.___level * indent }}
                    >
                      <div
                        className={classNames("PE-Body-Tree-arrow-click", {
                          "PE-Body-Tree-arrow-disabled":
                            isLoading || row?.isLeaf === true,
                        })}
                        onClick={(e) => {
                          onTreeNodeClick({
                            record: row,
                            primaryKey,
                            dataSource: flatDataSource,
                            openRowKeys: [...(openRowKeys || [])],
                          });
                        }}
                      >
                        {row?.isLeaf === false
                          ? isLoading
                            ? iconLoading
                            : isOpen
                            ? iconExpand
                            : iconFold
                          : null}
                      </div>
                    </div>
                  ) : null}
                  <div className="PE-Body-Tree-col-cell">
                    {typeof col?.cell === "function"
                      ? col?.cell(
                          col?.dataIndex ? row[col?.dataIndex] : undefined,
                          rowIndex,
                          row
                        )
                      : col?.dataIndex
                      ? row[col?.dataIndex]
                      : undefined}
                  </div>
                </div>
              </td>
            );
          })}
        </tr>
      ) : null;

      if (!isTreeGroupView) {
        if (!Array.isArray(tableArr[0])) {
          tableArr[0] = [renderTr];
        } else {
          tableArr[0].push(renderTr);
        }
      } else if (row.___level === 0) {
        tableArr[++tableIndex] = [renderTr];
      } else {
        tableArr[tableIndex].push(renderTr);
      }
    });

    return (
      <>
        {tableArr.map((tbody, index) => (
          <table
            className={classNames("PE-Body-table", {
              "PE-Body-auto-width": autoWidth,
              "PE-Body-Tree-group-view-table": isTreeGroupView,
              "PE-Body-Tree-group-view-table-round": isTreeGroupView && round,
            })}
            key={index}
          >
            <ColGroup columns={flatColumn} autoWidth={autoWidth} />
            <tbody>{tbody}</tbody>
          </table>
        ))}
        {!dataSource?.length && !loading ? (
          <table
            className={classNames("PE-Body-table", {
              "PE-Body-auto-width": autoWidth,
            })}
          >
            <ColGroup columns={flatColumn} autoWidth={autoWidth} />
            <tbody>
              <tr>
                <td className="PE-Body-empty" colSpan={flatColumn.length}>
                  {emptyContent ?? "????????????"}
                </td>
              </tr>
            </tbody>
          </table>
        ) : null}
      </>
    );
  };

  return (
    <div
      className={classNames("PE-Body", "PE-Body-Tree", {
        "PE-Body-round": round,
      })}
    >
      {renderTable()}
    </div>
  );
});
