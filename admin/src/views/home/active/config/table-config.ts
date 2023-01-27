import { ITable } from "@/components/page-table/type";
const tableConfig: ITable = {
  propList: [
    {
      prop: "name",
      label: "活动名称",
      align: "center",
      minWidth: "30",
    },
    {
      prop: "placeData.name",
      label: "活动地点",
      align: "center",
      minWidth: "30",
    },
    {
      prop: "userData.name",
      label: "活动举办人",
      align: "center",
      minWidth: "30",
    },
    {
      prop: "placeData.volume",
      label: "人数限制",
      align: "center",
      minWidth: "30",
    },
    {
      prop: "joinUser",
      label: "参与人数",
      slotName: "joinUser",
      align: "center",
      minWidth: "30",
    },
    {
      prop: "isPass",
      label: "审核状态",
      slotName: "isPass",
      align: "center",
      minWidth: "30",
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
