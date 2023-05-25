import * as React from "react";
import * as classNames from "classnames";
import { debounce, cloneDeep } from "lodash";
import { getReactPropsFromDOM } from "./../utils";
import ColGroup from "./ColGroup";
import { ColumnProps } from "./../interface";
import CellRender from "./CellRender";

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
  refDomTable?: React.MutableRefObject<HTMLDivElement | null>;
  useVirtual?: boolean;
  canDragRow?: boolean;
  dragRowSlot?: React.ReactNode;
  onDragRowEnd?: (dragRowNode: any, dropRowNode: any, dropPos: string) => void;
  onDragRowIsAvailable?: (dragRowNode: any, dropRowNode: any) => boolean;
}

interface TreeNodeHandleParams {
  record: any;
  primaryKey: string;
  dataSource: Array<any>;
  openRowKeys: Array<any>;
  e?: MouseEvent;
  originOpenRowKeys: Array<any>;
}

interface PositionForV {
  rIndex: number;
  top: number;
  bottom: number;
  height: number;
  primaryId: string;
  isFirstTr: boolean;
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
  React.forwardRef(function BodyTree(
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
      openRowKeys: propOpenRowKeys,
      defaultOpenRowKeys = [],
      loadData,
      indent = 20,
      primaryKey,
      onRowOpen,
      isTreeGroupView,
      rowHeight,
      useVirtual,
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
      modifyRow,
      getOpenRowKeys: () => openRowKeys,
      appendRowChildren,
      setForceFreshFlag,
    }));

    const [openRowKeys, setOpenRowKeys] = React.useState(defaultOpenRowKeys);
    const [loadingKeys, setLoadingKeys] = React.useState([]);

    const dragStartEl = React.useRef<HTMLElement>(null);
    const dragNextEl = React.useRef<HTMLElement>(null);
    const dragNextPos = React.useRef<string>(null);

    // 在虚拟模式下，如果数据源变化，scroll 下显示旧内容，此flag刷新
    const forceFreshFlag = React.useRef<boolean>(false);

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

      // 此种遍历顺序下，必须保证 openKey 中一定要包含可以追溯到根的值，否则会出错
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

    // 显示的 dataSource
    const showDs = React.useMemo(() => {
      return flatDataSource?.filter((row) => {
        return row.___level === 0 || showTreeNodes.includes(row[primaryKey]);
      });
    }, [showTreeNodes, flatDataSource]);
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
    let endIndex = 0;

    const setForceFreshFlag = (value: boolean) => {
      forceFreshFlag.current = value;
    };
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
      const bufferTop = showDs.slice(
        startIndex.current - bufferCount.current,
        startIndex.current
      );
      const bufferBottom = showDs.slice(
        endIndex,
        endIndex + bufferCount.current
      );

      // 合并 buffer 及可视区域的数据
      const visibleData = [
        ...bufferTop,
        ...showDs.slice(startIndex.current, endIndex),
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
        forceRender ||
        forceFreshFlag.current
      ) {
        paddingTop.current = _paddingTop;
        setVisibleData(visibleData);
      }
    };
    const delRow = (primaryIds: Array<string>) => {
      // 遍历执行删除
      primaryIds.map((id) => {
        // 删除位置
        {
          const index = positionforV.current.findIndex(
            (item) => item.primaryId === id
          );
          if (index > -1) {
            // 更新后面的数据的位置信息
            for (let i = index + 1; i < positionforV.current.length; i++) {
              if (i === index + 1) {
                positionforV.current[i].top = positionforV.current[i - 1].top;
              } else {
                positionforV.current[i].top =
                  positionforV.current[i - 1].bottom;
              }

              positionforV.current[i].bottom =
                positionforV.current[i].top + positionforV.current[i].height;
            }

            positionforV.current.splice(index, 1);
          }
        }

        // 删除 flatDataSource 里面的数据
        {
          const index = flatDataSource.findIndex(
            (item) => item[primaryKey] === id
          );
          if (index > -1) {
            flatDataSource.splice(index, 1);
          }
        }

        // 删除 openRowKeys 里面的数据
        {
          const i = openRowKeys.indexOf(id);
          if (i > -1) {
            openRowKeys.splice(i, 1);
          }
        }

        // 删除 showDs
        {
          const index = showDs.findIndex((item) => item[primaryKey] === id);
          if (index > -1) {
            showDs.splice(index, 1);
          }
        }
        // 删除 showTreeNodes
        {
          const index = showTreeNodes.findIndex((item) => item === id);
          if (index > -1) {
            showTreeNodes.splice(index, 1);
          }
        }
      });

      resizeForV(refDomTable.current, true);
    };
    const modifyRow = (
      primaryId: string,
      callback?: (data: any) => any,
      forceRender = true
    ) => {
      // 从 dataSource 里面查询出来，以及其在 dataSource 中的位置 parent
      function findDataInDs(ds: Array<any>, primaryId: string): any {
        for (let i = 0; i < ds.length; i++) {
          if (ds[i][primaryKey] === primaryId) {
            return [ds[i], ds, i];
          } else if (Array.isArray(ds[i].children)) {
            const data = findDataInDs(ds[i].children, primaryId);
            if (data) return data;
          }
        }
      }

      const [data, parent, dataIndex] =
        findDataInDs(dataSource, primaryId) || [];

      if (!data) {
        return;
      }

      const newData = callback?.(data) || data;

      // 修改 dataSource 的对应位置的条目
      {
        parent[dataIndex] = { ...parent[dataIndex], ...newData };
      }

      // 此方法只对当前数据进行修改，不做children的处理
      {
        const index = flatDataSource.findIndex(
          (item) => item[primaryKey] === primaryId
        );

        if (index > -1) {
          // 修改 flatDataSource 的对应位置的条目
          flatDataSource[index] = { ...flatDataSource[index], ...newData };
        }
      }

      {
        const index = showDs.findIndex(
          (item) => item[primaryKey] === primaryId
        );

        if (index > -1) {
          // 修改 showDs 的对应位置的条目
          showDs[index] = { ...showDs[index], ...newData };
        }
      }

      resizeForV(refDomTable.current, forceRender);
    };
    const appendRowChildren = (
      primaryId: string,
      callback?: (data: any) => any,
      forceRender = true
    ) => {
      // 从 dataSource 里面查询出来，以及其在 dataSource 中的位置 parent
      function findDataInDs(ds: Array<any>, primaryId: string): any {
        for (let i = 0; i < ds.length; i++) {
          if (ds[i][primaryKey] === primaryId) {
            return [ds[i], ds, i];
          } else if (Array.isArray(ds[i].children)) {
            const data = findDataInDs(ds[i].children, primaryId);
            if (data) return data;
          }
        }
      }

      const [data, parent, dataIndex] =
        findDataInDs(dataSource, primaryId) || [];

      if (!data) {
        return;
      }

      const newChildren = callback?.(data) || data?.children || [];

      // 修改 dataSource
      {
        parent[dataIndex] = { ...parent[dataIndex], children: newChildren };
      }

      // 修改 flatDataSource
      {
        const index = flatDataSource.findIndex(
          (item) => item[primaryKey] === primaryId
        );

        if (index > -1) {
          flatDataSource[index] = {
            ...flatDataSource[index],
            children: newChildren,
          };

          flatDataSource.splice(
            index + 1,
            0,
            ...newChildren.map((_item: any) => ({
              ..._item,
              ___level: flatDataSource[index].___level + 1,
            }))
          );
        }
      }

      // 修改 showDs
      {
        const index = showDs.findIndex(
          (item) => item[primaryKey] === primaryId
        );
        if (index > -1) {
          showDs[index] = {
            ...showDs[index],
            children: newChildren,
          };

          showDs.splice(
            index + 1,
            0,
            ...newChildren.map((_item: any) => ({
              ..._item,
              ___level: showDs[index].___level + 1,
            }))
          );
        }
      }

      // 修改 showTreeNodes
      {
        showTreeNodes.push(...newChildren.map((item: any) => item[primaryKey]));
      }

      // 修改 positionforV
      {
        const index = positionforV.current.findIndex(
          (item) => item.primaryId === primaryId
        );
        if (index > -1) {
          positionforV.current.splice(
            index + 1,
            0,
            ...newChildren.map((item: any, i: number) => {
              return {
                rIndex: index + i + 1,
                top: positionforV.current[index].bottom + i * rowHeight,
                bottom:
                  positionforV.current[index].bottom + (i + 1) * rowHeight,
                height: rowHeight,
                primaryId: item[primaryKey],
                isFirstTr: item.___level === 0,
              };
            })
          );

          // 更新后面的数据的位置信息
          for (
            let i = index + 1 + newChildren.length;
            i < positionforV.current.length;
            i++
          ) {
            positionforV.current[i].top = positionforV.current[i - 1].bottom;

            positionforV.current[i].bottom =
              positionforV.current[i].top + positionforV.current[i].height;
          }
        }
      }

      resizeForV(refDomTable.current, forceRender);
    };

    // 初始化位置信息
    React.useEffect(() => {
      if (useVirtual) {
        positionforV.current = showDs.map((row, index) => {
          return {
            rIndex: index,
            top: index * rowHeight,
            bottom: (index + 1) * rowHeight,
            height: rowHeight,
            primaryId: row[primaryKey],
            isFirstTr: row.___level === 0,
          };
        });
      }
    }, [showDs, rowHeight, useVirtual]);

    // 获取实际 Row DOM 的高度
    React.useLayoutEffect(() => {
      const groupTableEl =
        refPEBody.current?.querySelectorAll?.(".PE-Body-table");

      if (
        useVirtual &&
        refPEBody.current &&
        groupTableEl?.length &&
        positionforV.current.length
      ) {
        const domTable = refDomTable?.current;

        if (!domTable) {
          return;
        }

        const isDirUp = domTable.scrollTop < preScrollTop.current;
        let isAdjusted = false;

        preScrollTop.current = domTable.scrollTop;

        Array.from(groupTableEl).forEach((gTableItem: HTMLElement) => {
          Array.from(gTableItem.querySelector("tbody")?.children || []).forEach(
            (item: HTMLElement, itemIndex) => {
              const index = +item.getAttribute("data-row-index");
              let height = item.offsetHeight;

              // 由于 ds 的变化导致数量可能抖动 无法对齐
              if (positionforV.current.length < index) {
                return;
              }

              if (itemIndex === 0) {
                if (
                  item.classList.contains("PE-Body-Tree-group-view-row-parent")
                ) {
                  gTableItem.classList.remove("PE-Body-Tree-clear-padding");
                  height +=
                    item.getBoundingClientRect().y -
                    gTableItem.getBoundingClientRect().y;
                } else {
                  gTableItem.classList.add("PE-Body-Tree-clear-padding");
                }
              }

              const oldHeight = positionforV.current?.[index]?.height || 0;
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
            }
          );
        });
      }
    });

    if (useVirtual) {
      if (visibleData.length === 0 && showDs.length > 0) {
        updateVisibleDataAndLayout();
      }

      stylePeBody["height"] =
        positionforV.current[positionforV.current.length - 1]?.bottom ||
        "unset";
      stylePeBody["paddingTop"] = paddingTop.current;
    }
    // ⬆⬆⬆ 虚拟滚动专用 ⬆⬆⬆

    const onTreeNodeClick = (params: TreeNodeHandleParams) => {
      const {
        record,
        primaryKey,
        dataSource,
        openRowKeys,
        e,
        originOpenRowKeys,
      } = params;
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

      // 进行折叠处理
      if (index > -1) {
        const ids = getChildrenKeyById(id);

        // 只要当前节点折叠，则当前节点下所有节点都进行闭合
        // 待优化：判断次数太多，理论上只判断一层就可以了。因为也只展开一层
        ids.forEach((id, idIndex) => {
          const i = openRowKeys.indexOf(id);
          if (i > -1) {
            openRowKeys.splice(i, 1);
          }

          if (useVirtual) {
            i > -1 && originOpenRowKeys.splice(i, 1);
            // 折叠的行不做删除
            if (idIndex === 0) {
              return;
            }
            // 删除位置
            {
              const index = positionforV.current.findIndex(
                (item) => item.primaryId === id
              );
              if (index > -1) {
                // 更新后面的数据的位置信息
                for (let i = index + 1; i < positionforV.current.length; i++) {
                  if (i === index + 1) {
                    positionforV.current[i].top =
                      positionforV.current[i - 1].top;
                  } else {
                    positionforV.current[i].top =
                      positionforV.current[i - 1].bottom;
                  }

                  positionforV.current[i].bottom =
                    positionforV.current[i].top +
                    positionforV.current[i].height;
                }

                positionforV.current.splice(index, 1);
              }
            }
            // 删除 showDs
            {
              const index = showDs.findIndex((item) => item[primaryKey] === id);
              if (index > -1) {
                showDs.splice(index, 1);
              }
            }
            // 删除 showTreeNodes
            {
              const index = showTreeNodes.findIndex((item) => item === id);
              if (index > -1) {
                showTreeNodes.splice(index, 1);
              }
            }
          }
        });
      }
      // 进行展开处理
      else {
        openRowKeys.push(id);

        if (useVirtual) {
          originOpenRowKeys.push(id);
          flatDataSource.forEach((item) => {
            // 找到当前节点的子节点 进行插入
            if (item[primaryKey] === id) {
              if (item.children?.length) {
                // 找到 showDs 的位置，进行插入
                {
                  const index = showDs.findIndex(
                    (item) => item[primaryKey] === id
                  );
                  if (index > -1) {
                    showDs.splice(
                      index + 1,
                      0,
                      ...item.children.map((_item: any) => ({
                        ..._item,
                        ___level: item.___level + 1,
                      }))
                    );
                  }
                }
                // 找到 position 的位置，进行插入
                {
                  const index = positionforV.current.findIndex(
                    (item) => item.primaryId === id
                  );
                  if (index > -1) {
                    positionforV.current.splice(
                      index + 1,
                      0,
                      ...item.children.map((item: any, i: number) => {
                        return {
                          rIndex: index + i + 1,
                          top:
                            positionforV.current[index].bottom + i * rowHeight,
                          bottom:
                            positionforV.current[index].bottom +
                            (i + 1) * rowHeight,
                          height: rowHeight,
                          primaryId: item[primaryKey],
                          isFirstTr: item.___level === 0,
                        };
                      })
                    );

                    // 更新后面的数据的位置信息
                    for (
                      let i = index + 1 + item.children.length;
                      i < positionforV.current.length;
                      i++
                    ) {
                      positionforV.current[i].top =
                        positionforV.current[i - 1].bottom;

                      positionforV.current[i].bottom =
                        positionforV.current[i].top +
                        positionforV.current[i].height;
                    }
                  }
                }
                // showTreeNodes
                {
                  showTreeNodes.push(
                    ...item.children.map((item: any) => item[primaryKey])
                  );
                }
              }
            }
          });
        }
      }

      // 如果没有提供 props，则直接修改内部 state
      if (!propOpenRowKeys && !useVirtual) {
        setOpenRowKeys([...openRowKeys]);
      } else if (useVirtual) {
        resizeForV(refDomTable.current, true);
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
            if (!propOpenRowKeys && !useVirtual) {
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

      (useVirtual ? visibleData : showDs)?.map((row, rowIndex, arr) => {
        const isOpen = openRowKeys.includes(row[primaryKey]);
        const isLoading = loadingKeys.includes(row[primaryKey]);
        const rIndex = useVirtual
          ? (startIndex.current - bufferCount.current < 0
              ? 0
              : startIndex.current - bufferCount.current) + rowIndex
          : rowIndex;
        const renderTr = (
          <tr
            key={rIndex}
            data-row-index={rIndex}
            data-raw={row}
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
              // 合并单元格处理
              const matchCellIndex = notRenderCellIndex
                .map((cellIndex) => cellIndex.toString())
                .indexOf([rowIndex, colIndex].toString());

              if (matchCellIndex > -1) {
                // 此处删不删数组中的项，其实无所谓
                notRenderCellIndex.splice(matchCellIndex, 1);
                return null;
              }

              const attrs =
                cellProps?.(rIndex, colIndex, col?.dataIndex, row) || {};

              // warning: tree 下不建议合并行
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
                        {canDragRow && row?.isCanDrag !== false ? (
                          <div
                            className="PE-Body-drag-row"
                            draggable={
                              canDragRow && row?.isCanDrag !== false
                                ? "true"
                                : "false"
                            }
                          >
                            {dragRowSlot ?? iconDragRow}
                          </div>
                        ) : null}
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
                              originOpenRowKeys: openRowKeys,
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
                      <CellRender col={col} row={row} rowIndex={rIndex} />
                    </div>
                  </div>
                </td>
              );
            })}
          </tr>
        );

        if (!isTreeGroupView) {
          if (!Array.isArray(tableArr[0])) {
            tableArr[0] = [renderTr];
          } else {
            tableArr[0].push(renderTr);
          }
        } else if (row.___level === 0) {
          tableArr[++tableIndex] = [renderTr];
        } else {
          if (tableIndex === -1) {
            tableArr[++tableIndex] = [];
          }
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
                    {emptyContent ?? "没有数据"}
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
        ref={refPEBody}
        style={stylePeBody}
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
        {renderTable()}
      </div>
    );
  })
);
