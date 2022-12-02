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
  maxBodyHeight?: number | string;
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
  <img src="data:image/svg+xml;base64,CjxzdmcgdD0iMTY2OTIxMjgwMTQ3NSIgY2xhc3M9Imljb24iIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwLWlkPSIyMTY2IgogICAgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiPgogICAgPHN0eWxlPgogICAgICAgIEBrZXlmcmFtZXMgbG9hZGluZ1N2ZyB7CiAgICAgICAgICAgIDEwMCUgewogICAgICAgICAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgIDwvc3R5bGU+CiAgICA8cGF0aAogICAgICAgIGQ9Ik04NzYuODY0IDc4Mi41OTJjMy4yNjQgMCA2LjI3Mi0zLjIgNi4yNzItNi42NTYgMC0zLjQ1Ni0zLjAwOC02LjU5Mi02LjI3Mi02LjU5Mi0zLjI2NCAwLTYuMjcyIDMuMi02LjI3MiA2LjU5MiAwIDMuNDU2IDMuMDA4IDYuNjU2IDYuMjcyIDYuNjU2eiBtLTE0MC41NDQgMTUzLjM0NGMyLjMwNCAyLjQzMiA1LjU2OCAzLjg0IDguNzY4IDMuODRhMTIuMTYgMTIuMTYgMCAwIDAgOC44MzItMy44NCAxMy43NiAxMy43NiAwIDAgMCAwLTE4LjU2IDEyLjIyNCAxMi4yMjQgMCAwIDAtOC44MzItMy44NCAxMi4xNiAxMi4xNiAwIDAgMC04Ljc2OCAzLjg0IDEzLjY5NiAxMy42OTYgMCAwIDAgMCAxOC41NnpNNTUyLjMyIDEwMTguMjRjMy40NTYgMy42NDggOC4zMiA1Ljc2IDEzLjE4NCA1Ljc2YTE4LjM2OCAxOC4zNjggMCAwIDAgMTMuMTg0LTUuNzYgMjAuNjA4IDIwLjYwOCAwIDAgMCAwLTI3Ljk2OCAxOC4zNjggMTguMzY4IDAgMCAwLTEzLjE4NC01LjgyNCAxOC4zNjggMTguMzY4IDAgMCAwLTEzLjE4NCA1Ljc2IDIwLjYwOCAyMC42MDggMCAwIDAgMCAyOC4wMzJ6IG0tMTk4LjMzNi01Ljc2YzQuNjA4IDQuOCAxMS4wNzIgNy42OCAxNy42IDcuNjhhMjQuNDQ4IDI0LjQ0OCAwIDAgMCAxNy41MzYtNy42OCAyNy40NTYgMjcuNDU2IDAgMCAwIDAtMzcuMjQ4IDI0LjQ0OCAyNC40NDggMCAwIDAtMTcuNTM2LTcuNjggMjQuNDQ4IDI0LjQ0OCAwIDAgMC0xNy42IDcuNjggMjcuNTIgMjcuNTIgMCAwIDAgMCAzNy4xODR6IG0tMTc1LjY4LTkxLjg0YzUuNzYgNi4wOCAxMy44MjQgOS42IDIxLjk1MiA5LjZhMzAuNTkyIDMwLjU5MiAwIDAgMCAyMi4wMTYtOS42IDM0LjM2OCAzNC4zNjggMCAwIDAgMC00Ni41OTIgMzAuNTkyIDMwLjU5MiAwIDAgMC0yMi4wMTYtOS42IDMwLjU5MiAzMC41OTIgMCAwIDAtMjEuOTUyIDkuNiAzNC4zNjggMzQuMzY4IDAgMCAwIDAgNDYuNTkyeiBtLTEyMS4xNTItMTU5LjM2YzYuOTEyIDcuMzYgMTYuNjQgMTEuNjQ4IDI2LjM2OCAxMS42NDhhMzYuNzM2IDM2LjczNiAwIDAgMCAyNi40MzItMTEuNTg0IDQxLjI4IDQxLjI4IDAgMCAwIDAtNTUuOTM2IDM2LjczNiAzNi43MzYgMCAwIDAtMjYuNDMyLTExLjU4NCAzNi44IDM2LjggMCAwIDAtMjYuMzY4IDExLjUyIDQxLjI4IDQxLjI4IDAgMCAwIDAgNTZ6TTEyLjczNiA1NjQuNjcyYTQyLjg4IDQyLjg4IDAgMCAwIDMwLjc4NCAxMy40NCA0Mi44OCA0Mi44OCAwIDAgMCAzMC43ODQtMTMuNDQgNDguMTI4IDQ4LjEyOCAwIDAgMCAwLTY1LjIxNiA0Mi44OCA0Mi44OCAwIDAgMC0zMC43Mi0xMy40NCA0Mi44OCA0Mi44OCAwIDAgMC0zMC44NDggMTMuNDQgNDguMTI4IDQ4LjEyOCAwIDAgMCAwIDY1LjIxNnogbTM5LjgwOC0xOTUuMzkyYTQ4Ljk2IDQ4Ljk2IDAgMCAwIDM1LjIgMTUuMzYgNDguOTYgNDguOTYgMCAwIDAgMzUuMi0xNS4zNiA1NC45NzYgNTQuOTc2IDAgMCAwIDAtNzQuNTYgNDguOTYgNDguOTYgMCAwIDAtMzUuMi0xNS40MjQgNDguOTYgNDguOTYgMCAwIDAtMzUuMiAxNS40MjQgNTQuOTc2IDU0Ljk3NiAwIDAgMCAwIDc0LjU2ek0xNjguMzIgMjEyLjQ4YzEwLjM2OCAxMS4wMDggMjQuOTYgMTcuNDA4IDM5LjY4IDE3LjQwOCAxNC41OTIgMCAyOS4xODQtNi40IDM5LjU1Mi0xNy40MDhhNjEuODg4IDYxLjg4OCAwIDAgMCAwLTgzLjg0IDU1LjEwNCA1NS4xMDQgMCAwIDAtMzkuNjE2LTE3LjQwOGMtMTQuNjU2IDAtMjkuMjQ4IDYuNC0zOS42MTYgMTcuNDA4YTYxLjg4OCA2MS44ODggMCAwIDAgMCA4My44NHpNMzM3LjM0NCAxMjQuOGMxMS41MiAxMi4xNiAyNy43MTIgMTkuMjY0IDQzLjk2OCAxOS4yNjQgMTYuMjU2IDAgMzIuNDQ4LTcuMDQgNDMuOTY4LTE5LjI2NGE2OC42NzIgNjguNjcyIDAgMCAwIDAtOTMuMTg0IDYxLjI0OCA2MS4yNDggMCAwIDAtNDMuOTY4LTE5LjI2NCA2MS4yNDggNjEuMjQ4IDAgMCAwLTQzLjk2OCAxOS4yNjQgNjguNzM2IDY4LjczNiAwIDAgMCAwIDkzLjE4NHogbTE4OS42MzItMS4wODhjMTIuNjcyIDEzLjQ0IDMwLjUyOCAyMS4yNDggNDguNDQ4IDIxLjI0OHMzNS43MTItNy44MDggNDguMzg0LTIxLjI0OGE3NS41ODQgNzUuNTg0IDAgMCAwIDAtMTAyLjQ2NEE2Ny4zOTIgNjcuMzkyIDAgMCAwIDU3NS4zNiAwYy0xNy45MiAwLTM1Ljc3NiA3LjgwOC00OC40NDggMjEuMjQ4YTc1LjU4NCA3NS41ODQgMCAwIDAgMCAxMDIuNDY0eiBtMTczLjgyNCA4Ni41OTJjMTMuODI0IDE0LjU5MiAzMy4yOCAyMy4xMDQgNTIuNzM2IDIzLjEwNCAxOS41ODQgMCAzOS4wNC04LjUxMiA1Mi44LTIzLjEwNGE4Mi40MzIgODIuNDMyIDAgMCAwIDAtMTExLjc0NCA3My40NzIgNzMuNDcyIDAgMCAwLTUyLjgtMjMuMTY4Yy0xOS41MiAwLTM4LjkxMiA4LjUxMi01Mi43MzYgMjMuMTY4YTgyLjQzMiA4Mi40MzIgMCAwIDAgMCAxMTEuNzQ0eiBtMTI0LjAzMiAxNTguNTI4YzE0Ljk3NiAxNS44NzIgMzYuMDMyIDI1LjA4OCA1Ny4yMTYgMjUuMDg4IDIxLjEyIDAgNDIuMjQtOS4yMTYgNTcuMTUyLTI1LjA4OGE4OS4zNDQgODkuMzQ0IDAgMCAwIDAtMTIxLjA4OCA3OS42MTYgNzkuNjE2IDAgMCAwLTU3LjE1Mi0yNS4wODhjLTIxLjE4NCAwLTQyLjI0IDkuMjE2LTU3LjIxNiAyNS4wODhhODkuMzQ0IDg5LjM0NCAwIDAgMCAwIDEyMS4wODh6IG01MC40MzIgMjA0LjAzMmMxNi4xMjggMTcuMDg4IDM4Ljc4NCAyNy4wMDggNjEuNjMyIDI3LjAwOCAyMi43ODQgMCA0NS40NC05LjkyIDYxLjU2OC0yNy4wMDhhOTYuMjU2IDk2LjI1NiAwIDAgMCAwLTEzMC40MzIgODUuNzYgODUuNzYgMCAwIDAtNjEuNTY4LTI3LjA3MmMtMjIuODQ4IDAtNDUuNDQgOS45ODQtNjEuNjMyIDI3LjA3MmE5Ni4xOTIgOTYuMTkyIDAgMCAwIDAgMTMwLjQzMnoiCiAgICAgICAgZmlsbD0iIzI2MjYyNiIgcC1pZD0iMjE2NyIgc3R5bGU9ImFuaW1hdGlvbjpsb2FkaW5nU3ZnIDJzIGxpbmVhciBpbmZpbml0ZTt0cmFuc2Zvcm0tb3JpZ2luOmNlbnRlcjsiPjwvcGF0aD4KPC9zdmc+" />
);

export default React.memo(function BodyTree({
  dataSource,
  flatColumn = [],
  emptyContent,
  autoWidth,
  round,
  loading,
  cellProps,
  maxBodyHeight,
  lockLeftColumns = [],
  lockRightColumns = [],
  openRowKeys: propOpenRowKeys,
  defaultOpenRowKeys = [],
  loadData,
  indent = 20,
  primaryKey,
  onRowOpen,
}: Props) {
  const [openRowKeys, setOpenRowKeys] = React.useState(defaultOpenRowKeys);
  const [loadingKeys, setLoadingKeys] = React.useState([]);

  React.useEffect(() => {
    propOpenRowKeys && setOpenRowKeys(propOpenRowKeys);
  }, [propOpenRowKeys]);

  // 打平树型 DS
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

  // 读取拍平后的 dataSoure 和 openRowKeys，把所有能显示的节点 计算出来
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

    // 获取某个节点下面所有的子孙节点。结果会包含当前节点
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

      // 只要当前节点折叠，则当前节点下所有节点都进行闭合
      ids.forEach((id) => {
        const i = openRowKeys.indexOf(id);
        if (i > -1) {
          openRowKeys.splice(i, 1);
        }
      });
    } else {
      openRowKeys.push(id);
    }

    // 如果没有提供 props，则直接修改内部 state
    if (!propOpenRowKeys) {
      setOpenRowKeys([...openRowKeys]);
    }

    // 处理好的 openRowKeys，当前节点的 id，展开 true 折叠 false，record
    onRowOpen?.(openRowKeys, id, index === -1, record);

    // 如果有 loadData，且当前节点是折叠状态，则加载数据
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

          // 闭合当前节点
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

  return (
    <div
      className={classNames("PE-Body", "PE-Body-Tree", {
        "PE-Body-round": round,
      })}
      style={{ maxHeight: maxBodyHeight }}
    >
      <table
        className={classNames("PE-Body-table", {
          "PE-Body-auto-width": autoWidth,
        })}
      >
        <ColGroup columns={flatColumn} autoWidth={autoWidth} />
        <tbody>
          {flatDataSource?.map((row, rowIndex, arr) => {
            const isOpen = openRowKeys.includes(row[primaryKey]);
            const isLoading = loadingKeys.includes(row[primaryKey]);
            const isShow =
              row.___level === 0 || showTreeNodes.includes(row[primaryKey]);

            return isShow ? (
              <tr
                key={rowIndex}
                data-row-index={rowIndex}
                className={classNames("PE-Body-row", {
                  "PE-Body-row-first": rowIndex == 0,
                  "PE-Body-row-last": rowIndex == arr.length - 1,
                })}
              >
                {flatColumn?.map((col, colIndex, arr) => {
                  const lockStyle: React.CSSProperties = {};

                  const attrs =
                    cellProps?.(rowIndex, colIndex, col?.dataIndex, row) || {};

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
                        "PE-Body-Tree-col": colIndex === 0,
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
                    </td>
                  );
                })}
              </tr>
            ) : null;
          })}
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
