import { ITable } from "@/components/page-table/type";
const tableConfig: ITable = {
  propList: [
    {
      prop: "id",
      label: "订单编号",
      align: "center",
      minWidth: "30",
    },
    {
      prop: "userData.name",
      label: "兑换者",
      align: "center",
      minWidth: "30",
    },
    {
      prop: "giftData.image",
      slotName: "image",
      label: "礼品图片",
      align: "center",
      minWidth: "30",
    },
    {
      prop: "userData.address",
      label: "收货地址",
      align: "center",
      minWidth: "120",
    },
    {
      prop: "status",
      slotName:"status",
      label: "发货状态",
      align: "center",
      minWidth: "30",
    },
    {
      prop: 'moment',
      label: '兑换时间',
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
