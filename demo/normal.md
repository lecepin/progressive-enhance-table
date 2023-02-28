---
title: 常规
order: 0
---

```jsx
import React from "react";
import ReactDOM from "react-dom";
import PETable from "pe-table";

const App = () => {
  return (
    <div>
     <PETable
      columns={[
   
        {
          dataIndex: 'sex',
          title: '性别',
          alignHeader: 'center',
          children: [
            {
              dataIndex: 'boy',
              title: '男',
              width: 100,
            },
            { dataIndex: 'girl', title: '女', width: 100 },
          ],
        },     {
          dataIndex: 'name',
          title: '姓名',
          alignHeader: 'center',
          align: 'center',
          width: 100,
        },
        {
          dataIndex: 'age',
          title: '年龄',
          width: 100,
        },
        {
          dataIndex: 'addr',
          title: '地区',
          alignHeader: 'center',
          children: [
            {
              dataIndex: 'in',
              title: '国内',
              alignHeader: 'center',

              children: [
                {
                  dataIndex: 'bj',
                  title: '北京',
                  width: 100,
                },
                {
                  dataIndex: 'sh',
                  title: '上海',
                  width: 100,
                },
                {
                  dataIndex: 'hz',
                  title: '杭州',
                  width: 100,
                },
              ],
            },
            { dataIndex: 'out', title: '国外', width: 100 },
          ],
        },
      ]}
      dataSource={[
        { id: 1, name: '张三', sex: '男', age: '18' },
        { id: 2, name: '李四', sex: '女', age: '28' },
        { id: 3, name: '王五', sex: '女', age: '48' },
        { id: 4, name: '赵六', sex: '男', age: '8' },
      ]}
      fullWidth
    />
    </div>
  );
};

ReactDOM.render(<App />, mountNode);
```
