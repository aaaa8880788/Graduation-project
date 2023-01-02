import { ITable } from "@/components/page-table/type";
const tableConfig: ITable = {
  propList: [
    {
      prop: "name",
      label: "活动地点",
      align: "center",
      minWidth: "60",
    },
    {
      prop: "status",
      label: "使用状态",
      align: "center",
      minWidth: "60",
      slotName: 'status'
    },
    {
      prop: "volume",
      label: "容纳人数",
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
