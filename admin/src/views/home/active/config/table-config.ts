import { ITable } from "@/components/page-table/type";
const tableConfig: ITable = {
  propList: [
    {
      prop: "name",
      label: "活动",
      align: "center",
      minWidth: "60",
    },
    {
      prop: "placeId",
      label: "活动地点",
      align: "center",
      minWidth: "60",
      slotName: 'placeId'
    },
    {
      prop: "body",
      label: "活动内容",
      align: "center",
      minWidth: "60",
    },
    {
      prop: "userId",
      label: "发布者",
      align: "center",
      minWidth: "60",
      slotName: 'userId'
    },
    {
      prop: 'moment',
      label: '发布时间',
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
