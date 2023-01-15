import { IForm } from "@/components/page-dialog/type";
import localCache from '@/utils/local-cache'

const addDialogConfig: IForm = {
  formItems: [
    {
      field: "title",
      type: "input",
      label: "视频标题",
      placeholder: "请输入视频标题",
      rules: [
        {
          required: true,
          message: "请输入视频标题",
          trigger: "blur",
        },
      ],
    },
    {
      field: 'type',
      type: 'select',
      label: '视频类型',
      placeholder: '请选择视频类型',
      options: [
        { label: '时事要闻', value: 0 , key: 0},
        { label: '新思想', value: 1, key: 1 },
        { label: '党史', value: 2, key: 2 },
        { label: '党建', value: 3, key: 3 }
      ],
      rules: [
        {
          required: true,
          message: '请选择视频类型',
          trigger: 'change',
        },
      ]
    },
    {
      field: "body",
      type: "input",
      label: "视频介绍",
      placeholder: "请输入视频介绍",
      otherOptions:{
        type:'textarea',
        autosize:{ 
          minRows: 3
        }
      },
      rules: [
        {
          required: true,
          message: "请输入视频介绍",
          trigger: "blur",
        },
      ],
    },
    {
      label: "视频文件",
      field: "vedio",
      type: "vedioUpload",
      otherOptions: {
        action: import.meta.env.VITE_APP_VEDIO_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
      },
      rules: [
        {
          required: true,
          message: "请上传视频文件",
          trigger: "change",
        },
      ],
    },
  ],
  labelWidth: "90px",
};
const editDialogConfig: IForm = {
  formItems: [
    {
      field: "title",
      type: "input",
      label: "视频标题",
      placeholder: "请输入视频标题",
      rules: [
        {
          required: true,
          message: "请输入视频标题",
          trigger: "blur",
        },
      ],
    },
    {
      field: 'type',
      type: 'select',
      label: '视频类型',
      placeholder: '请选择视频类型',
      options: [
        { label: '时事要闻', value: 0 , key: 0},
        { label: '新思想', value: 1, key: 1 },
        { label: '党史', value: 2, key: 2 },
        { label: '党建', value: 3, key: 3 }
      ],
      rules: [
        {
          required: true,
          message: '请选择视频类型',
          trigger: 'change',
        },
      ]
    },
    {
      field: "body",
      type: "input",
      label: "视频介绍",
      placeholder: "请输入视频介绍",
      otherOptions:{
        type:'textarea',
        autosize:{ 
          minRows: 3
        }
      },
      rules: [
        {
          required: true,
          message: "请输入视频介绍",
          trigger: "blur",
        },
      ],
    },
    {
      label: "视频文件",
      field: "vedio",
      type: "vedioUpload",
      otherOptions: {
        action: import.meta.env.VITE_APP_VEDIO_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
      },
      rules: [
        {
          required: true,
          message: "请上传视频文件",
          trigger: "change",
        },
      ],
    },
  ],
  labelWidth: "90px",
};
const detailDialogConfig: IForm = {
  formItems: [
    {
      field: "title",
      type: "input",
      label: "视频标题",
      placeholder: "请输入视频标题",
      rules: [
        {
          required: true,
          message: "请输入视频标题",
          trigger: "blur",
        },
      ],
      otherOptions:{
        disabled:true
      }
    },
    {
      field: 'type',
      type: 'select',
      label: '视频类型',
      placeholder: '请选择视频类型',
      options: [
        { label: '时事要闻', value: 0 , key: 0},
        { label: '新思想', value: 1, key: 1 },
        { label: '党史', value: 2, key: 2 },
        { label: '党建', value: 3, key: 3 }
      ],
      rules: [
        {
          required: true,
          message: '请选择视频类型',
          trigger: 'change',
        },
      ],
      otherOptions:{
        disabled:true
      }
    },
    {
      field: "body",
      type: "input",
      label: "视频介绍",
      placeholder: "请输入视频介绍",
      otherOptions:{
        type:'textarea',
        autosize:{ 
          minRows: 3
        },
        disabled:true
      },
      rules: [
        {
          required: true,
          message: "请输入视频介绍",
          trigger: "blur",
        },
      ],
    },
    {
      label: "视频文件",
      field: "vedio",
      type: "vedioUpload",
      otherOptions: {
        action: import.meta.env.VITE_APP_VEDIO_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
        disabled:true
      },
      rules: [
        {
          required: true,
          message: "请上传视频文件",
          trigger: "change",
        },
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
