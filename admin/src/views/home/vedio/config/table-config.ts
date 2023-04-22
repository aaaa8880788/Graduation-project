import { ITable } from "@/components/page-table/type";
const tableConfig: ITable = {
  propList: [
    {
      prop: "title",
      label: "视频标题",
      align: "center",
      minWidth: "60",
    },
    {
      prop: "type",
      label: "视频类型",
      align: "center",
      minWidth: "60",
      slotName: 'type'
    },
    {
      prop: "body",
      label: "视频描述",
      align: "center",
      minWidth: "60",
    },
    {
      prop: "supportUser",
      label: "收藏人数",
      align: "center",
      slotName: 'supportUser',
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
