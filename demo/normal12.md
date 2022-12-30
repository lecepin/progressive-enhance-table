---
title: 滚动到指定行
order: 11
---

调用实例方法 `scrollToViewByPrimaryKey` 进行实现。

```jsx
import React from "react";
import ReactDOM from "react-dom";
import PETable from "pe-table";

const App = () => {
  const ref = React.useRef();

  return (
    <>
      <button
        onClick={() => {
          ref.current.scrollToViewByPrimaryKey("14", (el) => {
            Array.from(el.children).map((el) => {
              el.classList.remove("find");
              setTimeout(() => {
                el.classList.add("find");
              }, 100);
            });
          });
        }}
      >
        查找 赵六8
      </button>
      <PETable
        columns={[
          {
            dataIndex: "name",
            title: "姓名",
            alignHeader: "center",
            width: 100,
          },
          {
            dataIndex: "sex",
            title: "性别",
            width: 100,
            align: "center",
          },
          {
            dataIndex: "age",
            title: "年龄",
            width: 100,
          },
        ]}
        ref={ref}
        autoWidth
        round
        maxHeight={200}
        dataSource={[
          { id: 1, name: "张三1", sex: "男", age: "18" },
          { id: 2, name: "李四2", sex: "女", age: "28" },
          { id: 3, name: "王五3", sex: "女", age: "48" },
          { id: 4, name: "赵六4", sex: "男", age: "8" },
          { id: 11, name: "张三5", sex: "男", age: "18" },
          { id: 12, name: "李四6", sex: "女", age: "28" },
          { id: 13, name: "王五7", sex: "女", age: "48" },
          { id: 14, name: "赵六8", sex: "男", age: "8" },
          { id: 111, name: "张三9", sex: "男", age: "18" },
          { id: 122, name: "李四10", sex: "女", age: "28" },
          { id: 133, name: "王五11", sex: "女", age: "48" },
          { id: 144, name: "赵六12", sex: "男", age: "8" },
        ]}
      />
    </>
  );
};

ReactDOM.render(<App />, mountNode);
```

```css
@keyframes find {
  0% {
    background-color: rgba(0, 121, 242, 0.1);
  }
  100% {
    background-color: #fff;
  }
}

.find {
  animation: 4s find;
}
```
