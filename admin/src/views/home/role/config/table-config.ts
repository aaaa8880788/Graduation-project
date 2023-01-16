import { ITable } from "@/components/page-table/type";
const tableConfig: ITable = {
  propList: [
    {
      prop: "name",
      label: "角色名称",
      align: "center",
      minWidth: "40",
    },
    {
      prop: "introduce",
      label: "角色介绍",
      align: "center",
      minWidth: "80",
    },
    {
      prop: "request",
      label: "申请要求",
      slotName: "request",
      align: "center",
      minWidth: "120",
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
