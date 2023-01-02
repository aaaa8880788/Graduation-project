import { ITable } from "@/components/page-table/type";
const tableConfig: ITable = {
  propList: [
    {
      prop: "name",
      label: "礼品名称",
      align: "center",
      minWidth: "60",
    },
    {
      prop: "image",
      label: "礼品图片",
      align: "center",
      slotName: "image",
      minWidth: "30",
    },
    {
      prop: "score",
      label: "积分值",
      align: "center",
      minWidth: "60",
    },
    {
      prop: "total",
      label: "礼品库存",
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
