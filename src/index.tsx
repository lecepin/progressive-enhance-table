import * as React from "react";
import * as classNames from "classnames";
import { TableProps, ColumnProps } from "./interface";
import Loading from "./components/Loading";
import Header from "./components/Header";
import Body from "./components/Body";
import BodyTree from "./components/BodyTree";
import { logger } from "./utils";

import "./index.less";

interface GroupColumnProps extends ColumnProps {
  colSpan?: number;
  rowSpan?: number;
}

export default React.memo(
  React.forwardRef(function PETable(props: TableProps, ref) {
    const {
      loading: propLoading = false,
      autoWidth: propAutoWidth = false,
      round: propRound = false,
      style: propStyle = {},
      primaryKey: propPrimaryKey = "id",
      rowHeight: propRowHeight = 40,
      fullWidth: propFullWidth = false,
      canDragRow: propCanDragRow = false,
    } = props;

    const refTable = React.useRef<HTMLDivElement>(null);
    const refReszieBar = React.useRef<HTMLDivElement>(null);
    const refBody = React.useRef<any>(null);
    const refBodyTree = React.useRef<any>(null);
    const [dataSource, setDataSource] = React.useState<Array<any>>([]);
    const refActualWidth = React.useRef<number>(0);

    React.useImperativeHandle(ref, () => ({
      ref: refTable?.current,
      scrollToViewByPrimaryKey,
      delRow,
      getDataSource: () => dataSource,
      modifyRow,
      getOpenRowKeys: () =>
        props.isTree
          ? refBodyTree?.current?.getOpenRowKeys()
          : props.openRowKeys,
      appendRowChildren,
    }));

    React.useEffect(() => {
      setDataSource(props.dataSource);
    }, [props.dataSource]);

    const [
      flatColumn,
      groupColumn,
      lockLeftArray,
      lockRightArray,
      lockLeftFullWidth,
      lockRightFullWidth,
    ] = React.useMemo(() => {
      // 取排序冻结列后的数组，仅一级处理
      const getSortLockArray = (columns: ColumnProps[]) => {
        const lockLeftArray: Array<GroupColumnProps> = [];
        const lockRightArray: Array<GroupColumnProps> = [];
        const unLockArray: Array<GroupColumnProps> = [];

        columns.map((col) => {
          if (col.lock === "left") {
            !col?.children?.length && lockLeftArray.push(col);
          } else if (col.lock === "right") {
            !col?.children?.length && lockRightArray.push(col);
          } else {
            unLockArray.push(col);
          }
        });

        return {
          columns: [...lockLeftArray, ...unLockArray, ...lockRightArray],
          leftColumns: lockLeftArray,
          rightColumns: lockRightArray,
        };
      };

      // 存储所有叶子节点，可以获取总列数，及渲染 <col> 使用
      const flatChildren: ColumnProps[] = [];
      // 将树型结构转换为平铺的二维数组，可xxx
      const groupChildren: Array<Array<GroupColumnProps>> = [];
      let columns;
      let leftColumns: GroupColumnProps[] = [];
      let rightColumns: GroupColumnProps[] = [];

      if (props.autoWidth) {
        columns = props.columns;
      } else {
        const sortLockArray = getSortLockArray(props.columns);

        columns = sortLockArray.columns;
        leftColumns = sortLockArray.leftColumns;
        rightColumns = sortLockArray.rightColumns;
      }

      // 使用 columns 初始化 flatChildren 和 groupChildren
      const getChildren = (
        propsChildren: ColumnProps[] = [],
        level: number
      ) => {
        groupChildren[level] = groupChildren[level] || [];
        propsChildren.forEach((child) => {
          if (child?.children?.length) {
            getChildren(child.children, level + 1);
          } else {
            flatChildren.push(child);
          }
          groupChildren[level].push(child);
        });
      };

      // 计算 每个节点的 colspan
      const getColSpan = (children: ColumnProps[], colSpan?: number) => {
        colSpan = colSpan || 0;
        children.forEach((child) => {
          if (child?.children?.length) {
            colSpan = getColSpan(child.children, colSpan);
          } else {
            colSpan += 1;
          }
        });
        return colSpan;
      };

      getChildren(columns, 0);
      // 计算每个节点的 colspan，并在原数据中添加 colSpan 属性
      groupChildren.forEach((groupChild, i) => {
        groupChild.forEach((child, j) => {
          if (child?.children?.length) {
            child.colSpan = getColSpan(child.children);
            child.rowSpan = 1;
            groupChildren[i][j] = child;
          } else {
            // 计算应该跨多少行
            child.rowSpan = groupChildren.length - i;
            child.colSpan = 1;
            groupChildren[i][j] = child;
          }
        });
      });

      return [
        flatChildren,
        groupChildren,
        leftColumns,
        rightColumns,
        leftColumns.reduce((pre, cur) => pre + (cur?.width ?? 0), 0) + 10,
        rightColumns.reduce((pre, cur) => pre + (cur?.width ?? 0), 0) + 10,
      ];
    }, [props.columns, props.autoWidth]);

    const renderLockMask = () => {
      const rst = [];

      if (lockLeftArray.length) {
        rst.push(
          <div
            key="1"
            className="PETable-lock-mask PETable-lock-mask-left"
            style={{
              width: lockLeftFullWidth,
            }}
          >
            <div className="PETable-lock-mask-left-shadow" />
          </div>
        );
      }
      if (lockRightArray.length) {
        rst.push(
          <div
            key="2"
            className="PETable-lock-mask PETable-lock-mask-right"
            style={{
              width: lockRightFullWidth,
            }}
          >
            <div className="PETable-lock-mask-right-shadow" />
          </div>
        );
      }

      return rst;
    };

    const syncLockMask = (refTable: HTMLElement, left: number) => {
      if (!propAutoWidth) {
        const elLeft = refTable?.querySelector(
          ":scope > .PETable-lock-mask-left"
        ) as HTMLElement;
        const elRight = refTable?.querySelector(
          ":scope > .PETable-lock-mask-right"
        ) as HTMLElement;

        if (elLeft) {
          elLeft.style.display = left > 0 ? "block" : "none";
        }

        if (elRight) {
          elRight.style.display =
            left < refTable.scrollWidth - refTable.clientWidth
              ? "block"
              : "none";
        }
      }
    };

    const scrollToViewByPrimaryKey = (
      primaryKey: string,
      callback: (el: HTMLElement | null) => void
    ) => {
      const elHeader = refTable.current?.querySelector(
        ":scope > .PE-header"
      ) as HTMLElement;

      if (props.useVirtual) {
        if (!refTable.current) {
          return;
        }

        // 查找到位置信息 然后滚动过去 进行渲染后 再查询元素
        const positionInfo = props.isTree
          ? refBodyTree.current.getPositionInfoByPrimaryId?.(primaryKey)
          : refBody.current.getPositionInfoByPrimaryId?.(primaryKey);
        const maxScrollTop =
          refTable.current.scrollHeight - refTable.current.clientHeight;

        if (!positionInfo?.top) {
          return;
        }

        refTable.current.scrollTop = Math.min(maxScrollTop, positionInfo.top);
      }

      // 等待上面部分渲染完成，否则找不到元素
      setTimeout(() => {
        const el = refTable.current?.querySelector(
          `:scope > .PE-Body tr[data-primary-id="${primaryKey}"]`
        ) as HTMLElement;

        if (el && elHeader) {
          refTable.current.scrollTop +=
            el.getBoundingClientRect().top -
            elHeader.getBoundingClientRect().bottom;
        }
        callback(el);
      }, 50);
    };

    const delRow = (primaryId: string) => {
      if (props.isTree) {
        const getChildrenKeyById = function (id: any) {
          const ret = [id];
          let index = -1;

          const loop = (data: Array<any>) => {
            data.forEach((item) => {
              ret.push(item[propPrimaryKey]);

              if (item.children) {
                loop(item.children);
              }
            });
          };

          dataSource.forEach((item, i) => {
            if (item[propPrimaryKey] === id) {
              if (item.children) {
                loop(item.children);
                index = i;
              }
            }
          });

          if (index > -1) {
            dataSource.splice(index, 1);
          }

          return ret;
        };
        refBodyTree.current?.delRow?.(getChildrenKeyById(primaryId) || []);
      } else {
        // 删除数组项目
        const index = dataSource.findIndex(
          (item) => item[propPrimaryKey] === primaryId
        );

        if (index > -1) {
          dataSource.splice(index, 1);
          refBody.current?.delRow?.(primaryId);
        }
      }
    };

    const modifyRow = (
      primaryId: string,
      callback?: (data: any) => any,
      forceRender = true
    ) => {
      if (!refBodyTree.current) {
        return;
      }

      refBodyTree.current.modifyRow(primaryId, callback, forceRender);
    };

    const appendRowChildren = (
      primaryId: string,
      callback?: (data: any) => any,
      forceRender = true
    ) => {
      if (!refBodyTree.current) {
        return;
      }

      refBodyTree.current.appendRowChildren(primaryId, callback, forceRender);
    };

    // 同步多个区域水平滚动
    React.useEffect(() => {
      if (!refTable.current) {
        return;
      }

      syncLockMask(refTable.current, refTable.current.scrollLeft);
    }, [refTable.current, propAutoWidth]);

    // Safari 宽度兼容问题，必须先在css中设置宽度100%，随后任意值都可以。不然无效，即便js修改这个值
    React.useEffect(() => {
      if (!refTable.current || propAutoWidth) {
        return;
      }

      const _actualWidth = flatColumn.reduce(
        (pre, cur) => pre + (cur?.width ?? 0),
        0
      );

      refActualWidth.current = _actualWidth;

      // 依赖 datasource 的变化，时序上
      [
        refTable.current?.querySelector?.(":scope > .PE-header"),
        refTable.current?.querySelector?.(":scope > .PE-Body"),
        ...Array.from(
          refTable.current?.querySelectorAll?.(":scope > .PE-Body > table") ||
            []
        ),
        refTable.current?.querySelector?.(":scope > .PE-header > table"),
      ].forEach((el: HTMLElement) => {
        if (el) {
          if (el.tagName === "DIV") {
            el.style.minWidth = refActualWidth.current + "px";
          } else {
            // 解决 td 溢出无法控制的问题
            el.style.width = refActualWidth.current + "px";
          }
        }
      });
    }, [refTable.current, propAutoWidth, flatColumn, dataSource]);

    // 处理 容器 Resize 后的一些同步问题
    const resizeObserverContainer = React.useMemo(() => {
      logger.log("resizeObserverContainer create");
      return new ResizeObserver((entries) => {
        logger.log("resizeObserverContainer callback");
        for (const entry of entries) {
          syncLockMask(refTable.current, entry.target.scrollLeft);

          // 虚拟滚动使用
          if (props.useVirtual) {
            props.isTree
              ? refBodyTree.current?.resizeForV?.(entry.target)
              : refBody.current?.resizeForV?.(entry.target);
          }
        }
      });
    }, [propAutoWidth]);

    React.useEffect(() => {
      if (!refTable.current) {
        return;
      }

      resizeObserverContainer.observe(refTable.current);
      logger.log("ResizeObserverContainer observe");

      return () => {
        resizeObserverContainer.disconnect();
        logger.log("ResizeObserverContainer disconnect");
      };
    }, [resizeObserverContainer, refTable.current, props.columns]);

    // 监听滚动条
    React.useEffect(() => {
      const listener = () => {
        syncLockMask(refTable.current, refTable.current.scrollLeft);

        if (props.useVirtual) {
          props.isTree
            ? refBodyTree.current?.scrollForV?.(refTable.current)
            : refBody.current?.scrollForV?.(refTable.current);

          // 虚拟场景，同步没出来的宽度
          [
            refTable.current?.querySelector?.(":scope > .PE-header"),
            refTable.current?.querySelector?.(":scope > .PE-Body"),
            ...Array.from(
              refTable.current?.querySelectorAll?.(
                ":scope > .PE-Body > table"
              ) || []
            ),
            refTable.current?.querySelector?.(":scope > .PE-header > table"),
          ].forEach((el: HTMLElement) => {
            if (el) {
              if (el.tagName === "DIV") {
                el.style.minWidth = refActualWidth.current + "px";
              } else {
                // 解决 td 溢出无法控制的问题
                el.style.width = refActualWidth.current + "px";
              }
            }
          });
        }
      };

      refTable.current.addEventListener(
        "scroll",
        listener,
        // 提升性能，不会阻止默认事件
        { passive: true }
      );

      return () => {
        refTable.current?.removeEventListener?.("scroll", listener);
      };
    }, [
      refTable.current,
      refBody.current,
      refBodyTree.current,
      props.useVirtual,
      props.isTree,
    ]);

    // dataSource 更新后 重置滚动条
    React.useEffect(() => {
      if (refTable.current && props.resetScrollbarPosition === true) {
        refTable.current.scrollTo?.(0, 0);
      }
    }, [dataSource, props.resetScrollbarPosition]);

    return (
      <Loading visible={propLoading}>
        <div
          className={classNames(
            "PETable",
            {
              "PETable-round": propRound,
              "PETable-full-width": propFullWidth && !props.isTreeGroupView,
              "PETable-full-width-groupview":
                propFullWidth && props.isTreeGroupView,
            },
            props.className
          )}
          style={{
            ...propStyle,
            maxHeight: props.maxHeight || "unset",
          }}
          ref={refTable}
        >
          {props.ContainerCustomRender}
          <Header
            columns={props.columns}
            flatColumn={flatColumn}
            groupColumn={groupColumn}
            autoWidth={propAutoWidth}
            round={propRound}
            lockLeftColumns={lockLeftArray}
            lockRightColumns={lockRightArray}
            refDomResizeBar={refReszieBar}
            refDomTable={refTable}
            onResizeChange={props.onResizeChange}
            isTreeGroupView={props.isTreeGroupView}
            rowHeight={propRowHeight}
            headerCustomRender={props.headerCustomRender}
          />
          {props.isTree ? (
            <BodyTree
              ref={refBodyTree}
              cellProps={props.cellProps}
              emptyContent={props.emptyContent}
              dataSource={dataSource}
              flatColumn={flatColumn}
              autoWidth={propAutoWidth}
              round={propRound}
              loading={propLoading}
              lockLeftColumns={lockLeftArray}
              lockRightColumns={lockRightArray}
              openRowKeys={props.openRowKeys}
              primaryKey={propPrimaryKey}
              loadData={props.loadData}
              indent={props.indent}
              onRowOpen={props.onRowOpen}
              defaultOpenRowKeys={props.defaultOpenRowKeys}
              isTreeGroupView={props.isTreeGroupView}
              rowHeight={propRowHeight}
              refDomTable={refTable}
              useVirtual={props.useVirtual}
              canDragRow={propCanDragRow}
              dragRowSlot={props.dragRowSlot}
              onDragRowEnd={props.onDragRowEnd}
              onDragRowIsAvailable={props.onDragRowIsAvailable}
            />
          ) : (
            <Body
              ref={refBody}
              cellProps={props.cellProps}
              emptyContent={props.emptyContent}
              dataSource={dataSource}
              flatColumn={flatColumn}
              autoWidth={propAutoWidth}
              round={propRound}
              loading={propLoading}
              lockLeftColumns={lockLeftArray}
              lockRightColumns={lockRightArray}
              primaryKey={propPrimaryKey}
              rowHeight={propRowHeight}
              useVirtual={props.useVirtual}
              mergedCellsStick={props.mergedCellsStick}
              refDomTable={refTable}
              canDragRow={propCanDragRow}
              dragRowSlot={props.dragRowSlot}
              onDragRowEnd={props.onDragRowEnd}
              onDragRowIsAvailable={props.onDragRowIsAvailable}
            />
          )}

          {renderLockMask()}

          <div className="PETable-resize-bar" ref={refReszieBar}></div>
          <div className="PETable-drag-row-line"></div>
        </div>
      </Loading>
    );
  })
);
