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
  <img
    className="PE-Body-Tree-loading-icon"
    src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PHBhdGggZD0iTTg3Ni44NjQgNzgyLjU5MmMzLjI2NCAwIDYuMjcyLTMuMiA2LjI3Mi02LjY1NiAwLTMuNDU2LTMuMDA4LTYuNTkyLTYuMjcyLTYuNTkyLTMuMjY0IDAtNi4yNzIgMy4yLTYuMjcyIDYuNTkyIDAgMy40NTYgMy4wMDggNi42NTYgNi4yNzIgNi42NTZ6TTczNi4zMiA5MzUuOTM2YzIuMzA0IDIuNDMyIDUuNTY4IDMuODQgOC43NjggMy44NGExMi4xNiAxMi4xNiAwIDAgMCA4LjgzMi0zLjg0IDEzLjc2IDEzLjc2IDAgMCAwIDAtMTguNTYgMTIuMjI0IDEyLjIyNCAwIDAgMC04LjgzMi0zLjg0IDEyLjE2IDEyLjE2IDAgMCAwLTguNzY4IDMuODQgMTMuNjk2IDEzLjY5NiAwIDAgMCAwIDE4LjU2em0tMTg0IDgyLjMwNGMzLjQ1NiAzLjY0OCA4LjMyIDUuNzYgMTMuMTg0IDUuNzZhMTguMzY4IDE4LjM2OCAwIDAgMCAxMy4xODQtNS43NiAyMC42MDggMjAuNjA4IDAgMCAwIDAtMjcuOTY4IDE4LjM2OCAxOC4zNjggMCAwIDAtMTMuMTg0LTUuODI0IDE4LjM2OCAxOC4zNjggMCAwIDAtMTMuMTg0IDUuNzYgMjAuNjA4IDIwLjYwOCAwIDAgMCAwIDI4LjAzMnptLTE5OC4zMzYtNS43NmM0LjYwOCA0LjggMTEuMDcyIDcuNjggMTcuNiA3LjY4YTI0LjQ0OCAyNC40NDggMCAwIDAgMTcuNTM2LTcuNjggMjcuNDU2IDI3LjQ1NiAwIDAgMCAwLTM3LjI0OCAyNC40NDggMjQuNDQ4IDAgMCAwLTE3LjUzNi03LjY4IDI0LjQ0OCAyNC40NDggMCAwIDAtMTcuNiA3LjY4IDI3LjUyIDI3LjUyIDAgMCAwIDAgMzcuMTg0em0tMTc1LjY4LTkxLjg0YzUuNzYgNi4wOCAxMy44MjQgOS42IDIxLjk1MiA5LjZhMzAuNTkyIDMwLjU5MiAwIDAgMCAyMi4wMTYtOS42IDM0LjM2OCAzNC4zNjggMCAwIDAgMC00Ni41OTIgMzAuNTkyIDMwLjU5MiAwIDAgMC0yMi4wMTYtOS42IDMwLjU5MiAzMC41OTIgMCAwIDAtMjEuOTUyIDkuNiAzNC4zNjggMzQuMzY4IDAgMCAwIDAgNDYuNTkyek01Ny4xNTIgNzYxLjI4YzYuOTEyIDcuMzYgMTYuNjQgMTEuNjQ4IDI2LjM2OCAxMS42NDhhMzYuNzM2IDM2LjczNiAwIDAgMCAyNi40MzItMTEuNTg0IDQxLjI4IDQxLjI4IDAgMCAwIDAtNTUuOTM2IDM2LjczNiAzNi43MzYgMCAwIDAtMjYuNDMyLTExLjU4NCAzNi44IDM2LjggMCAwIDAtMjYuMzY4IDExLjUyIDQxLjI4IDQxLjI4IDAgMCAwIDAgNTZ6TTEyLjczNiA1NjQuNjcyYTQyLjg4IDQyLjg4IDAgMCAwIDMwLjc4NCAxMy40NCA0Mi44OCA0Mi44OCAwIDAgMCAzMC43ODQtMTMuNDQgNDguMTI4IDQ4LjEyOCAwIDAgMCAwLTY1LjIxNiA0Mi44OCA0Mi44OCAwIDAgMC0zMC43Mi0xMy40NCA0Mi44OCA0Mi44OCAwIDAgMC0zMC44NDggMTMuNDQgNDguMTI4IDQ4LjEyOCAwIDAgMCAwIDY1LjIxNnpNNTIuNTQ0IDM2OS4yOGE0OC45NiA0OC45NiAwIDAgMCAzNS4yIDE1LjM2IDQ4Ljk2IDQ4Ljk2IDAgMCAwIDM1LjItMTUuMzYgNTQuOTc2IDU0Ljk3NiAwIDAgMCAwLTc0LjU2IDQ4Ljk2IDQ4Ljk2IDAgMCAwLTM1LjItMTUuNDI0IDQ4Ljk2IDQ4Ljk2IDAgMCAwLTM1LjIgMTUuNDI0IDU0Ljk3NiA1NC45NzYgMCAwIDAgMCA3NC41NnptMTE1Ljc3Ni0xNTYuOGMxMC4zNjggMTEuMDA4IDI0Ljk2IDE3LjQwOCAzOS42OCAxNy40MDggMTQuNTkyIDAgMjkuMTg0LTYuNCAzOS41NTItMTcuNDA4YTYxLjg4OCA2MS44ODggMCAwIDAgMC04My44NCA1NS4xMDQgNTUuMTA0IDAgMCAwLTM5LjYxNi0xNy40MDhjLTE0LjY1NiAwLTI5LjI0OCA2LjQtMzkuNjE2IDE3LjQwOGE2MS44ODggNjEuODg4IDAgMCAwIDAgODMuODR6bTE2OS4wMjQtODcuNjhjMTEuNTIgMTIuMTYgMjcuNzEyIDE5LjI2NCA0My45NjggMTkuMjY0IDE2LjI1NiAwIDMyLjQ0OC03LjA0IDQzLjk2OC0xOS4yNjRhNjguNjcyIDY4LjY3MiAwIDAgMCAwLTkzLjE4NCA2MS4yNDggNjEuMjQ4IDAgMCAwLTQzLjk2OC0xOS4yNjQgNjEuMjQ4IDYxLjI0OCAwIDAgMC00My45NjggMTkuMjY0IDY4LjczNiA2OC43MzYgMCAwIDAgMCA5My4xODR6bTE4OS42MzItMS4wODhjMTIuNjcyIDEzLjQ0IDMwLjUyOCAyMS4yNDggNDguNDQ4IDIxLjI0OHMzNS43MTItNy44MDggNDguMzg0LTIxLjI0OGE3NS41ODQgNzUuNTg0IDAgMCAwIDAtMTAyLjQ2NEE2Ny4zOTIgNjcuMzkyIDAgMCAwIDU3NS4zNiAwYy0xNy45MiAwLTM1Ljc3NiA3LjgwOC00OC40NDggMjEuMjQ4YTc1LjU4NCA3NS41ODQgMCAwIDAgMCAxMDIuNDY0ek03MDAuOCAyMTAuMzA0YzEzLjgyNCAxNC41OTIgMzMuMjggMjMuMTA0IDUyLjczNiAyMy4xMDQgMTkuNTg0IDAgMzkuMDQtOC41MTIgNTIuOC0yMy4xMDRhODIuNDMyIDgyLjQzMiAwIDAgMCAwLTExMS43NDQgNzMuNDcyIDczLjQ3MiAwIDAgMC01Mi44LTIzLjE2OGMtMTkuNTIgMC0zOC45MTIgOC41MTItNTIuNzM2IDIzLjE2OGE4Mi40MzIgODIuNDMyIDAgMCAwIDAgMTExLjc0NHptMTI0LjAzMiAxNTguNTI4YzE0Ljk3NiAxNS44NzIgMzYuMDMyIDI1LjA4OCA1Ny4yMTYgMjUuMDg4IDIxLjEyIDAgNDIuMjQtOS4yMTYgNTcuMTUyLTI1LjA4OGE4OS4zNDQgODkuMzQ0IDAgMCAwIDAtMTIxLjA4OCA3OS42MTYgNzkuNjE2IDAgMCAwLTU3LjE1Mi0yNS4wODhjLTIxLjE4NCAwLTQyLjI0IDkuMjE2LTU3LjIxNiAyNS4wODhhODkuMzQ0IDg5LjM0NCAwIDAgMCAwIDEyMS4wODh6bTUwLjQzMiAyMDQuMDMyYzE2LjEyOCAxNy4wODggMzguNzg0IDI3LjAwOCA2MS42MzIgMjcuMDA4IDIyLjc4NCAwIDQ1LjQ0LTkuOTIgNjEuNTY4LTI3LjAwOGE5Ni4yNTYgOTYuMjU2IDAgMCAwIDAtMTMwLjQzMiA4NS43NiA4NS43NiAwIDAgMC02MS41NjgtMjcuMDcyYy0yMi44NDggMC00NS40NCA5Ljk4NC02MS42MzIgMjcuMDcyYTk2LjE5MiA5Ni4xOTIgMCAwIDAgMCAxMzAuNDMyeiIgZmlsbD0iIzI2MjYyNiIvPjwvc3ZnPg=="
  />
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

  const renderTable = () => {
    let tableArr: Array<Array<any>> = [];
    let tableIndex = -1;

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

      if (row.___level === 0) {
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
          <tr>
            <td className="PE-Body-empty" colSpan={flatColumn.length}>
              {emptyContent ?? "没有数据"}
            </td>
          </tr>
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
