import { IForm } from "@/components/page-dialog/type";
import localCache from '@/utils/local-cache'

const addDialogConfig: IForm = {
  formItems: [
    {
      field: "title",
      type: "input",
      label: "文章标题",
      placeholder: "请输入文章标题",
      rules: [
        {
          required: true,
          message: "请输入文章标题",
          trigger: "blur",
        },
      ],
    },
    {
      field: 'type',
      type: 'select',
      label: '文章类型',
      placeholder: '请选择文章类型',
      options: [
        { label: '时事要闻', value: 0 , key: 0},
        { label: '新思想', value: 1, key: 1 },
        { label: '党史', value: 2, key: 2 },
        { label: '党建', value: 3, key: 3 }
      ],
      rules: [
        {
          required: true,
          message: '请选择文章类型',
          trigger: 'change',
        },
      ]
    },
    {
      field: "body",
      type: "quillEditor",
      label: "文章内容",
      placeholder: "请输入文章内容",
      otherOptions:{
        contentType:'html',
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
      },
      rules: [
        {
          required: true,
          message: "请输入文章内容",
          trigger: "blur",
        }
      ],
    }
  ],
  labelWidth: "90px",
};
const editDialogConfig: IForm = {
  formItems: [
    {
      field: "title",
      type: "input",
      label: "文章标题",
      placeholder: "请输入文章标题",
      rules: [
        {
          required: true,
          message: "请输入文章标题",
          trigger: "blur",
        },
      ],
    },
    {
      field: 'type',
      type: 'select',
      label: '文章类型',
      placeholder: '请选择文章类型',
      options: [
        { label: '时事要闻', value: 0 , key: 0},
        { label: '新思想', value: 1, key: 1 },
        { label: '党史', value: 2, key: 2 },
        { label: '党建', value: 3, key: 3 }
      ],
      rules: [
        {
          required: true,
          message: '请选择文章类型',
          trigger: 'change',
        },
      ]
    },
    {
      field: "body",
      type: "quillEditor",
      label: "文章内容",
      placeholder: "请输入文章内容",
      rules: [
        {
          required: true,
          message: "请输入文章内容",
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
  labelWidth: "90px",
};
const detailDialogConfig: IForm = {
  formItems: [
    {
      field: "title",
      type: "input",
      label: "文章标题",
      placeholder: "请输入文章标题",
      rules: [
        {
          required: true,
          message: "请输入文章标题",
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
      label: '文章类型',
      placeholder: '请选择文章类型',
      options: [
        { label: '时事要闻', value: 0 , key: 0},
        { label: '新思想', value: 1, key: 1 },
        { label: '党史', value: 2, key: 2 },
        { label: '党建', value: 3, key: 3 }
      ],
      rules: [
        {
          required: true,
          message: '请选择文章类型',
          trigger: 'change',
        },
      ],
      otherOptions:{
        disabled:true
      }
    },
    {
      field: "body",
      type: "quillEditor",
      label: "文章内容",
      placeholder: "请输入文章内容",
      rules: [
        {
          required: true,
          message: "请输入文章内容",
          trigger: "blur",
        }
      ],
      otherOptions:{
        contentType:'html',
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
        readOnly:true
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
