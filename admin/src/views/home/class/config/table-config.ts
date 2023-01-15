import { ITable } from "@/components/page-table/type";
const tableConfig: ITable = {
  propList: [
    {
      prop: "name",
      label: "专业名称",
      align: "center",
      minWidth: "60",
    },
    {
      prop: "title",
      label: "专业简称",
      align: "center",
      minWidth: "60",
    },
    {
      prop: "classData",
      label: "专业班级",
      slotName: "classData",
      align: "center",
      minWidth: "110",
    },
    {
      prop: "facultyId",
      label: "所属学院",
      slotName: "facultyId",
      align: "center",
      minWidth: "70",
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
