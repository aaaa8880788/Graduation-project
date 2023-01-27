import { IForm } from "@/components/page-dialog/type";
import localCache from '@/utils/local-cache'

const addDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "活动名称",
      placeholder: "请输入活动名称",
      rules: [
        {
          required: true,
          message: "请输入活动名称",
          trigger: "blur",
        },
      ],
    },
    {
      field: 'placeId',
      type: 'select',
      label: '活动地点',
      placeholder: '请选择活动地点',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择活动地点',
          trigger: 'change',
        },
      ],
    },
    {
      field: "placeVolume",
      type: "number",
      label: "活动最多参与人数",
      dataType: 'number',
      placeholder: "请选择活动地点",
      otherOptions:{
        min: 0,
        disabled: true
      },
    },
    {
      field: 'userId',
      type: 'select',
      label: '活动举办人',
      placeholder: '请选择活动举办人',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择活动举办人',
          trigger: 'change',
        },
      ],
    },
    {
      field: "score",
      type: "number",
      label: "活动积分",
      dataType: 'number',
      placeholder: "请输入活动积分",
      otherOptions:{
        min: 0,
      },
    },
    {
      field: "body",
      type: "quillEditor",
      label: "活动内容",
      placeholder: "请输入活动内容",
      rules: [
        {
          required: true,
          message: "请输入活动内容",
          trigger: "blur",
        }
      ],
      otherOptions:{
        contentType:'html',
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
      },
    }
  ],
  labelWidth: "160px",
};
const editDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "活动名称",
      placeholder: "请输入活动名称",
      rules: [
        {
          required: true,
          message: "请输入活动名称",
          trigger: "blur",
        },
      ],
    },
    {
      field: 'placeId',
      type: 'select',
      label: '活动地点',
      placeholder: '请选择活动地点',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择活动地点',
          trigger: 'change',
        },
      ],
    },
    {
      field: "placeVolume",
      type: "number",
      label: "活动最多参与人数",
      dataType: 'number',
      placeholder: "请选择活动地点",
      otherOptions:{
        min: 0,
        disabled: true
      },
    },
    {
      field: 'userId',
      type: 'select',
      label: '活动举办人',
      placeholder: '请选择活动举办人',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择活动举办人',
          trigger: 'change',
        },
      ],
    },
    {
      field: "score",
      type: "number",
      label: "活动积分",
      dataType: 'number',
      placeholder: "请输入活动积分",
      otherOptions:{
        min: 0,
      },
    },
    {
      field: "body",
      type: "quillEditor",
      label: "活动内容",
      placeholder: "请输入活动内容",
      rules: [
        {
          required: true,
          message: "请输入活动内容",
          trigger: "blur",
        }
      ],
      otherOptions:{
        contentType:'html',
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
      },
    }
  ],
  labelWidth: "160px",
};

const detailDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "活动名称",
      placeholder: "请输入活动名称",
      rules: [
        {
          required: true,
          message: "请输入活动名称",
          trigger: "blur",
        },
      ],
      otherOptions: {
        disabled: true
      }
    },
    {
      field: 'placeId',
      type: 'select',
      label: '活动地点',
      placeholder: '请选择活动地点',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择活动地点',
          trigger: 'change',
        },
      ],
      otherOptions: {
        disabled: true
      }
    },
    {
      field: "placeVolume",
      type: "number",
      label: "活动最多参与人数",
      dataType: 'number',
      placeholder: "请选择活动地点",
      otherOptions:{
        min: 0,
        disabled: true
      },
    },
    {
      field: 'userId',
      type: 'select',
      label: '活动举办人',
      placeholder: '请选择活动举办人',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择活动举办人',
          trigger: 'change',
        },
      ],
      otherOptions: {
        disabled: true
      }
    },
    {
      field: "score",
      type: "number",
      label: "活动积分",
      dataType: 'number',
      placeholder: "请输入活动积分",
      otherOptions:{
        min: 0,
        disabled: true
      },
    },
    {
      field: "body",
      type: "quillEditor",
      label: "活动内容",
      placeholder: "请输入活动内容",
      rules: [
        {
          required: true,
          message: "请输入活动内容",
          trigger: "blur",
        }
      ],
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
  labelWidth: "160px",
};
export {
  addDialogConfig,
  editDialogConfig,
  detailDialogConfig
};
