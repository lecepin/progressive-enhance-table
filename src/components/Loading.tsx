import * as React from "react";
import * as classNames from "classnames";

import "./Loading.less";

interface Props {
  visible: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export default React.memo(function Loading({
  visible,
  children,
  loadingComponent = (
    <img width="45" src="https://g.alicdn.com/uxcore/pic/loading.svg" />
  ),
}: Props) {
  return (
    <div className="PE-loading">
      {visible ? (
        <div className="PE-loading-indicator">{loadingComponent}</div>
      ) : null}
      <div
        className={classNames("PE-loading-content", {
          "PE-loading-loading": visible,
        })}
      >
        {children}
      </div>
    </div>
  );
});
