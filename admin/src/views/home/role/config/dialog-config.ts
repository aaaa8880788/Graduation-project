import { IForm } from "@/components/page-dialog/type";
import localCache from '@/utils/local-cache'

const addDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "角色名称",
      placeholder: "请输入角色名称",
      rules: [
        {
          required: true,
          message: "请输入角色名称",
          trigger: "blur",
        },
      ],
    },
    {
      field: "introduce",
      type: "input",
      label: "角色介绍",
      placeholder: "请输入角色介绍",
      otherOptions:{
        type:'textarea',
        autosize:{ 
          minRows: 3
        }
      }
    },
    {
      field: "request",
      type: "quillEditor",
      label: "申请要求",
      placeholder: "请输入申请要求",
      otherOptions:{
        contentType:'html',
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
      },
    }
  ],
  labelWidth: "90px",
};
const editDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "角色名称",
      placeholder: "请输入角色名称",
      rules: [
        {
          required: true,
          message: "请输入角色名称",
          trigger: "blur",
        },
      ],
    },
    {
      field: "introduce",
      type: "input",
      label: "角色介绍",
      placeholder: "请输入角色介绍",
      otherOptions:{
        type:'textarea',
        autosize:{ 
          minRows: 3
        }
      }
    },
    {
      field: "request",
      type: "quillEditor",
      label: "申请要求",
      placeholder: "请输入申请要求",
      otherOptions:{
        contentType:'html',
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
      },
    }
  ],
  labelWidth: "90px",
};
const detailDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "角色名称",
      placeholder: "请输入角色名称",
      rules: [
        {
          required: true,
          message: "请输入角色名称",
          trigger: "blur",
        },
      ],
      otherOptions: {
        disabled: true
      }
    },
    {
      field: "introduce",
      type: "input",
      label: "角色介绍",
      placeholder: "请输入角色介绍",
      otherOptions:{
        type:'textarea',
        autosize:{ 
          minRows: 3
        },
        disabled: true
      }
    },
    {
      field: "request",
      type: "quillEditor",
      label: "申请要求",
      placeholder: "请输入申请要求",
      otherOptions:{
        contentType:'html',
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
        readOnly: true
      },
    }
  ],
  labelWidth: "90px",
};
export {
  addDialogConfig,
  editDialogConfig,
  detailDialogConfig
};
