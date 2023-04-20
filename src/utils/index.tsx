import LpLogger from "lp-logger";

export function syncScrollX(
  elements: HTMLElement[],
  callback?: (scrollLeft: number) => void
): any {
  const noDealFlagSet: Set<HTMLElement> = new Set();
  const removeEventList: Array<() => void> = [];

  elements.forEach((element) => {
    const listener = () => {
      // 由下方 js 触发的，则不执行
      if (noDealFlagSet.has(element)) {
        noDealFlagSet.delete(element);
        return;
      }

      // 加个保险，可以无
      noDealFlagSet.clear();
      elements.forEach((el) => {
        if (el !== element) {
          noDealFlagSet.add(el);
          el.scrollLeft = element.scrollLeft;
          callback?.(element.scrollLeft);
        }
      });
    };

    element.addEventListener(
      "scroll",
      listener,
      // 提升性能，不会阻止默认事件
      { passive: true }
    );
    removeEventList.push(() => {
      element.removeEventListener("scroll", listener);
    });
  });

  return () => {
    removeEventList.map((item) => {
      item();
    });
  };
}

export const logger = new LpLogger({
  name: "PE-Table",
  level: "warn",
  search: "pe-log",
});

export function getReactPropsFromDOM(dom: any, prop: string) {
  const _name = Object.keys(dom).find(
    (e) =>
      e.indexOf("__reactProps$") > -1 || e.indexOf("__reactEventHandlers$") > -1
  );

  return dom?.[_name]?.[prop];
}
