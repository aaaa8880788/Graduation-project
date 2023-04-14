import { IForm } from "@/components/page-dialog/type";
import localCache from '@/utils/local-cache'

const addDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "礼品名称",
      placeholder: "请输入礼品名称",
      rules: [
        {
          required: true,
          message: "请输入礼品名称",
          trigger: "blur",
        },
      ],
    },
    {
      label: "礼品图片",
      field: "image",
      type: "imageUpload",
      otherOptions: {
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
      }
    },
    {
      field: "score",
      type: "number",
      label: "积分值",
      dataType: 'number',
      placeholder: "请输入积分值",
      otherOptions:{
        min: 0
      },
      rules: [
        {
          required: true,
          message: "请输入积分值",
          trigger: "blur",
        }
      ],
    },
    {
      field: "total",
      type: "number",
      label: "库存数量",
      dataType: 'number',
      placeholder: "请输入库存数量",
      otherOptions:{
        min: 0
      },
      rules: [
        {
          required: true,
          message: "请输入库存数量",
          trigger: "blur",
        }
      ],
    },
  ],
  labelWidth: "90px",
};
const editDialogConfig: IForm = {
  formItems: [
    {
      field: 'status',
      type: 'select',
      label: '发货状态',
      placeholder: '请选择发货状态',
      options: [
        { label: '未发货', value: 0 , key: 0 },
        { label: '已发货', value: 1, key: 1 },
        { label: '已完成', value: 2, key: 2 }
      ],
      rules: [
        {
          required: true,
          message: '请选择发货状态',
          trigger: 'change',
        },
      ]
    },
  ],
  labelWidth: "90px",
};
const detailDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "礼品名称",
      placeholder: "请输入礼品名称",
      rules: [
        {
          required: true,
          message: "请输入礼品名称",
          trigger: "blur",
        },
      ],
      otherOptions:{
        disabled:true
      }
    },
    {
      label: "礼品图片",
      field: "image",
      type: "imageUpload",
      otherOptions: {
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
        disabled:true
      }
    },
    {
      field: "score",
      type: "number",
      label: "积分值",
      dataType: 'number',
      placeholder: "请输入积分值",
      otherOptions:{
        min: 0,
        disabled:true
      },
      rules: [
        {
          required: true,
          message: "请输入积分值",
          trigger: "blur",
        }
      ],
    },
    {
      field: "total",
      type: "number",
      label: "库存数量",
      dataType: 'number',
      placeholder: "请输入库存数量",
      otherOptions:{
        min: 0,
        disabled:true
      },
      rules: [
        {
          required: true,
          message: "请输入库存数量",
          trigger: "blur",
        }
      ],
    },
  ],
  labelWidth: "90px",
};
export {
  addDialogConfig,
  editDialogConfig,
  detailDialogConfig
};
