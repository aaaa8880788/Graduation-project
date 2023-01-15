import { ITable } from "@/components/page-table/type";
const tableConfig: ITable = {
  propList: [
    {
      prop: "name",
      label: "姓名",
      align: "center",
      minWidth: "30",
    },
    {
      prop: "avatar",
      label: "头像",
      slotName: "avatar",
      align: "center",
      minWidth: "30",
    },
    {
      prop: "type",
      label: "类型",
      slotName: "type",
      align: "center",
      minWidth: "30",
    },
    {
      prop: "organizationId",
      label: "所属组织",
      slotName: "organizationId",
      align: "center",
      minWidth: "40",
    },
    {
      prop: "cardId",
      label: "工号/卡号",
      align: "center",
      minWidth: "40",
    },
    {
      prop: "phone",
      label: "手机号",
      align: "center",
      minWidth: "40",
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
