import * as React from "react";

export interface ColumnProps {
  dataIndex?: string;
  cell?:
    | React.ReactElement<any>
    | React.ReactNode
    | ((value: any, index: number, record: any) => any);
  title?: React.ReactElement<any> | React.ReactNode | (() => any);
  width?: number;
  minWidth?: number;
  align?: "left" | "center" | "right";
  alignHeader?: "left" | "center" | "right";
  lock?: "left" | "right";
  resizable?: boolean;
  children?: ColumnProps[];
}

export interface TableProps {
  className?: string;
  style?: React.CSSProperties;
  columns: ColumnProps[];
  loading?: boolean;
  emptyContent?: React.ReactNode;
  primaryKey?: string;
  onResizeChange?: (dataIndex: string, value: number) => void;
  isTree?: boolean;
  rowHeight?: number;
  indent?: number;
  maxHeight?: number | string;
  onRowOpen?: (
    openRowKeys: Array<any>,
    currentRowKey: string,
    expanded: boolean,
    currentRecord: any
  ) => void;
  dataSource: Array<any>;
  openRowKeys?: Array<any>;
  defaultOpenRowKeys?: Array<any>;
  loadingComponent?: () => React.ReactNode;
  cellProps?: (
    rowIndex: number,
    colIndex: number,
    dataIndex: string,
    record: any
  ) => any;
  loadData?: (record: any) => Promise<any>;
  isTreeGroupView?: boolean;
  autoWidth?: boolean;
  round?: boolean;
  useVirtual?: boolean;
  mergedCellsStick?: boolean;
  // dataSource 变化时，重置滚动条位置为 0
  resetScrollbarPosition?: boolean;
  fullWidth?: boolean;
  headerCustomRender?: React.ReactNode;
  ContainerCustomRender?: React.ReactNode;
}
