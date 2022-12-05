import * as React from "react";
import * as classNames from "classnames";
import { ColumnProps } from "./../interface";

import "./Resize.less";

interface Props {
  refDomResizeBar?: React.MutableRefObject<HTMLDivElement | null>;
  refDomTable?: React.MutableRefObject<HTMLDivElement | null>;
  col?: ColumnProps;
  onResizeChange?: (dataIndex: string, value: number) => void;
}

export default React.memo(function Resize({
  refDomResizeBar,
  refDomTable,
  col,
  onResizeChange,
}: Props) {
  const refResize = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const MIN_W = 40;
    const onMouseDown = (e: MouseEvent) => {
      if (
        !refResize.current ||
        !refDomResizeBar?.current ||
        !refDomTable?.current
      ) {
        return;
      }

      const { left: tableLeft } = refDomTable.current.getBoundingClientRect();
      const { left: ResizeLeft, width: resizeWidth } =
        refResize.current.getBoundingClientRect();
      const startFitX = ResizeLeft + resizeWidth / 2 - tableLeft;
      const lastClientX = e.clientX;
      let newWidth = col?.width ?? 0;

      refDomResizeBar.current.style.cssText = `display: block; left: ${startFitX}px;`;
      document.body.style.setProperty("user-select", "none");
      document.body.style.setProperty("cursor", "col-resize");
      document.documentElement.classList.add("PE-Resize-no-select");

      const onMouseMove = (e: MouseEvent) => {
        const newLeft = e.clientX - lastClientX + startFitX;
        if (newLeft > startFitX - (col?.width ?? 0) + MIN_W) {
          refDomResizeBar.current.style.cssText = `display: block; left: ${newLeft}px;`;
          newWidth = (col?.width ?? 0) + e.clientX - lastClientX;
        }
      };
      const onMouseUp = () => {
        refDomResizeBar.current.style.cssText = `display: none;`;
        document.body.style.setProperty("user-select", "");
        document.body.style.setProperty("cursor", "");
        document.documentElement.classList.remove("PE-Resize-no-select");
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        onResizeChange?.(col?.dataIndex ?? "", newWidth);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    refResize.current.addEventListener("mousedown", onMouseDown);

    return () => {
      refResize.current.removeEventListener("mousedown", onMouseDown);
    };
  }, [refResize.current, refDomResizeBar?.current, refDomTable?.current, col]);

  return <div className="PE-Resize" ref={refResize}></div>;
});

// onMouseDown = e => {
//     const { left: tableLeft, width: tableWidth } = this.props.tableEl.getBoundingClientRect();
//     if (!this.props.cellDomRef || !this.props.cellDomRef.current) {
//         return;
//     }
//     const { left: cellDomLeft } = this.props.cellDomRef.current.getBoundingClientRect();
//     this.lastPageX = e.pageX;
//     this.tLeft = tableLeft;
//     this.tRight = tableWidth;
//     this.startLeft = e.pageX - tableLeft;
//     this.cellLeft = cellDomLeft - tableLeft;

//     if (this.props.asyncResizable) this.showResizeProxy();
//     events.on(document, 'mousemove', this.onMouseMove);
//     events.on(document, 'mouseup', this.onMouseUp);
//     this.unSelect();
// };
