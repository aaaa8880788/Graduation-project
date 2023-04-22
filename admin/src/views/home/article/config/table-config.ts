import { ITable } from "@/components/page-table/type";
const tableConfig: ITable = {
  propList: [
    {
      prop: "title",
      label: "文章标题",
      align: "center",
      minWidth: "60",
    },
    {
      prop: "type",
      label: "文章类型",
      align: "center",
      minWidth: "60",
      slotName: 'type'
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
