import { ITable } from "@/components/page-table/type";
const tableConfig: ITable = {
  propList: [
    {
      prop: "name",
      label: "学院名称",
      align: "center",
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
