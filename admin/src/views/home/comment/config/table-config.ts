import { ITable } from "@/components/page-table/type";
const tableConfig: ITable = {
  propList: [
    {
      prop: "content",
      label: "评论内容",
      align: "center",
      minWidth: "100",
    },
    {
      prop: "commentType",
      slotName:"commentType",
      label: "评论类型",
      align: "center",
      minWidth: "30",
    },
    {
      prop: "status",
      slotName:"status",
      label: "审核状态",
      align: "center",
      minWidth: "40",
    },
    {
      prop: "supportUser",
      slotName:"supportUser",
      label: "收藏人数",
      align: "center",
      minWidth: "30",
    },
    {
      prop: 'moment',
      label: '创建时间',
      align: "center",
      minWidth: '60',
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
