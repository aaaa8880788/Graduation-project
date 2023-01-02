import { IForm } from "@/components/page-dialog/type";
import localCache from '@/utils/local-cache'

const addDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "用户名",
      placeholder: "请输入用户名",
      rules: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
    },
    {
      field: "password",
      type: "password",
      label: "密码",
      placeholder: "请输入密码",
      rules: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
      ],
    },
    {
      field: "title",
      type: "input",
      label: "昵称",
      placeholder: "请输入昵称"
    },
    {
      label: "头像",
      field: "avatar",
      type: "upload",
      otherOptions: {
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
      }
    },
    {
      field: 'type',
      type: 'select',
      label: '用户类型',
      placeholder: '请选择用户类型',
      options: [
        { label: '超级管理员', value: 0 , key: 0 , disabled:true},
        { label: '教师', value: 1, key: 1 }
      ],
      rules: [
        {
          required: true,
          message: '请选择用户类型',
          trigger: 'change',
        },
      ]
    },
  ],
  labelWidth: "90px",
};
const editDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "用户名",
      placeholder: "请输入用户名",
      rules: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
      otherOptions:{
        disabled:true
      }
    },
    {
      field: "password",
      type: "password",
      label: "密码",
      placeholder: "请输入密码",
      rules: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
      ],
    },
    {
      field: "title",
      type: "input",
      label: "昵称",
      placeholder: "请输入昵称"
    },
    {
      label: "头像",
      field: "avatar",
      type: "upload",
      otherOptions: {
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
      }
    },
    {
      field: 'type',
      type: 'select',
      label: '用户类型',
      placeholder: '请选择用户类型',
      options: [
        { label: '超级管理员', value: 0 , key: 0 , disabled:true},
        { label: '教师', value: 1, key: 1 }
      ],
      rules: [
        {
          required: true,
          message: '请选择用户类型',
          trigger: 'change',
        },
      ],
      otherOptions:{
        disabled:true
      }
    },
  ],
  labelWidth: "90px",
};
export {
  addDialogConfig,
  editDialogConfig
};
