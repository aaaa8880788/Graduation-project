import { IForm } from "@/components/page-dialog/type";
import localCache from '@/utils/local-cache'

const addDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "学院名称",
      placeholder: "请输入学院名称",
      rules: [
        {
          required: true,
          message: "请输入学院名称",
          trigger: "blur",
        },
      ],
    }
  ],
  labelWidth: "90px",
};
const editDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "学院名称",
      placeholder: "请输入学院名称",
      rules: [
        {
          required: true,
          message: "请输入学院名称",
          trigger: "blur",
        },
      ],
    }
  ],
  labelWidth: "90px",
};
export {
  addDialogConfig,
  editDialogConfig
};
