import { IForm } from "@/components/page-dialog/type";
import localCache from '@/utils/local-cache'

const addDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "学校名称",
      placeholder: "请输入学校名称",
      rules: [
        {
          required: true,
          message: "请输入学校名称",
          trigger: "blur",
        },
      ],
    },
    {
      label: "学校图片",
      field: "logo",
      type: "imageUpload",
      otherOptions: {
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
      }
    },
  ],
  labelWidth: "90px",
};
const editDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "学校名称",
      placeholder: "请输入学校名称",
      rules: [
        {
          required: true,
          message: "请输入学校名称",
          trigger: "blur",
        },
      ],
    },
    {
      label: "学校图片",
      field: "logo",
      type: "imageUpload",
      otherOptions: {
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
      }
    },
  ],
  labelWidth: "90px",
};
const detailDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "学校名称",
      placeholder: "请输入学校名称",
      rules: [
        {
          required: true,
          message: "请输入学校名称",
          trigger: "blur",
        },
      ],
      otherOptions: {
        disabled:true
      }
    },
    {
      label: "学校图片",
      field: "logo",
      type: "imageUpload",
      otherOptions: {
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
        disabled: true
      }
    },
  ],
  labelWidth: "90px",
};
export {
  addDialogConfig,
  editDialogConfig,
  detailDialogConfig
};
