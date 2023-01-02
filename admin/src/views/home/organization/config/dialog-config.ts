import { IForm } from "@/components/page-dialog/type";
import localCache from '@/utils/local-cache'

const addDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "组织名称",
      placeholder: "请输入组织名称",
      rules: [
        {
          required: true,
          message: "请输入组织名称",
          trigger: "blur",
        },
      ],
    },
    {
      field: "introduce",
      type: "input",
      label: "组织名称",
      placeholder: "请输入组织名称",
      otherOptions:{
        type:'textarea',
        autosize:{ 
          minRows: 3
        }
      }
    }
  ],
  labelWidth: "90px",
};
const editDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "组织名称",
      placeholder: "请输入组织名称",
      rules: [
        {
          required: true,
          message: "请输入组织名称",
          trigger: "blur",
        },
      ],
    },
    {
      field: "introduce",
      type: "input",
      label: "组织名称",
      placeholder: "请输入组织名称",
      otherOptions:{
        type:'textarea',
        autosize:{ 
          minRows: 3
        }
      }
    }
  ],
  labelWidth: "90px",
};
export {
  addDialogConfig,
  editDialogConfig
};
