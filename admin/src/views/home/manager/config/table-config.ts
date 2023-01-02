import { ITable } from "@/components/page-table/type";
const tableConfig: ITable = {
  propList: [
    {
      prop: "name",
      label: "用户名",
      align: "center",
      minWidth: "60",
    },
    {
      prop: "avatar",
      label: "头像",
      align: "center",
      slotName: "avatar",
      minWidth: "30",
    },
    {
      prop: "password",
      label: "密码",
      align: "center",
      minWidth: "30",
    },
    {
      prop: "type",
      label: "用户类型",
      align: "center",
      slotName: "type",
      minWidth: "60",
    },
    {
      prop: "title",
      label: "别名",
      align: "center",
      minWidth: "50",
    },
    {
      prop: 'moment',
      label: '创建时间',
      align: "center",
      minWidth: '80',
      slotName: 'createAt'
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
