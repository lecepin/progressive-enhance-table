import * as React from "react";
import * as classNames from "classnames";
import { TableProps, ColumnProps } from "./interface";
import * as utils from "./utils";
import Loading from "./components/Loading";
import Header from "./components/Header";
import Body from "./components/Body";
import BodyTree from "./components/BodyTree";

import "./index.less";

interface GroupColumnProps extends ColumnProps {
  colSpan?: number;
  rowSpan?: number;
}

export default React.memo(function PETable(props: TableProps) {
  const {
    loading: propLoading = false,
    autoWidth: propAutoWidth = false,
    round: propRound = false,
    style: propStyle = {},
    primaryKey: propPrimaryKey = "id",
  } = props;

  const refTable = React.useRef<HTMLDivElement>(null);
  const refReszieBar = React.useRef<HTMLDivElement>(null);

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
    const getChildren = (propsChildren: ColumnProps[] = [], level: number) => {
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
      const elBody = refTable?.querySelector(
        ":scope > .PE-Body"
      ) as HTMLElement;

      if (!elBody) {
        return;
      }

      if (elLeft) {
        elLeft.style.display = left > 0 ? "block" : "none";
      }

      if (elRight) {
        elRight.style.display =
          left < elBody.scrollWidth - elBody.clientWidth ? "block" : "none";
      }
    }
  };

  // 同步多个区域水平滚动
  React.useEffect(() => {
    if (!refTable.current) {
      return;
    }

    syncLockMask(refTable.current, 0);

    return utils.syncScrollX(
      [
        refTable.current.querySelector(":scope > .PE-Body"),
        refTable.current.querySelector(":scope > .PE-header"),
      ],
      (left) => {
        syncLockMask(refTable.current, left);
      }
    );
  }, [refTable.current]);

  // 处理 Body Resize 后的一些同步问题
  const resizeObserverBody = React.useMemo(
    () =>
      new ResizeObserver((entries) => {
        for (const entry of entries) {
          syncLockMask(refTable.current, entry.target.scrollLeft);
        }
      }),
    []
  );

  React.useEffect(() => {
    const elBody = refTable.current?.querySelector(":scope > .PE-Body");
    if (!elBody) {
      return;
    }

    resizeObserverBody.observe(elBody);

    return () => {
      resizeObserverBody.disconnect();
    };
  }, [
    resizeObserverBody,
    refTable.current?.querySelector(":scope > .PE-Body"),
    props.columns,
  ]);

  return (
    <Loading visible={propLoading}>
      <div
        className={classNames("PETable", props.className)}
        style={propStyle}
        ref={refTable}
      >
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
        />
        {props.isTree ? (
          <BodyTree
            cellProps={props.cellProps}
            emptyContent={props.emptyContent}
            dataSource={props.dataSource}
            flatColumn={flatColumn}
            autoWidth={propAutoWidth}
            round={propRound}
            loading={propLoading}
            maxBodyHeight={props.maxBodyHeight}
            lockLeftColumns={lockLeftArray}
            lockRightColumns={lockRightArray}
            openRowKeys={props.openRowKeys}
            primaryKey={propPrimaryKey}
            loadData={props.loadData}
            indent={props.indent}
            onRowOpen={props.onRowOpen}
            defaultOpenRowKeys={props.defaultOpenRowKeys}
          />
        ) : (
          <Body
            cellProps={props.cellProps}
            emptyContent={props.emptyContent}
            dataSource={props.dataSource}
            flatColumn={flatColumn}
            autoWidth={propAutoWidth}
            round={propRound}
            loading={propLoading}
            maxBodyHeight={props.maxBodyHeight}
            lockLeftColumns={lockLeftArray}
            lockRightColumns={lockRightArray}
          />
        )}

        {renderLockMask()}

        <div className="PETable-resize-bar" ref={refReszieBar}></div>
      </div>
    </Loading>
  );
});
