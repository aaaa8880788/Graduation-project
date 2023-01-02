import { ITable } from "@/components/page-table/type";
const tableConfig: ITable = {
  propList: [
    {
      prop: "content",
      label: "题目内容",
      align: "center",
      minWidth: "120",
    },
    {
      prop: "type",
      label: "题目类型",
      align: "center",
      slotName: 'type',
      minWidth: "60",
    },
    {
      prop: 'moment',
      label: '创建时间',
      align: "center",
      minWidth: '80',
      slotName: 'moment'
    },
    {
      slotName: "handle",
      label: "操作",
      align: "center",
    },
  ],
};

export {
  tableConfig
};
