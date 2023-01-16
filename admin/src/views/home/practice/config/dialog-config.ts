import { IForm } from "@/components/page-dialog/type";
import localCache from '@/utils/local-cache'

const addDialogConfig: IForm = {
  formItems: [
    {
      field: "content",
      type: "input",
      label: "题目内容",
      placeholder: "请输入题目内容",
      rules: [
        {
          required: true,
          message: "请输入题目内容",
          trigger: "blur",
        },
      ],
    },
    {
      field: "options",
      type: "customAdd",
      dataType:'array',
      label: "题目选项",
      placeholder: "请输入题目选项",
    },
    {
      field: 'answer',
      type: 'select',
      label: '题目答案',
      placeholder: '请选择题目答案',
      options: [],
      otherOptions:{
        multiple:true
      },
      rules: [
        {
          required: true,
          message: '请选择题目答案',
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
      field: "content",
      type: "input",
      label: "题目内容",
      placeholder: "请输入题目内容",
      rules: [
        {
          required: true,
          message: "请输入题目内容",
          trigger: "blur",
        },
      ],
    },
    {
      field: "options",
      type: "customAdd",
      dataType:'array',
      label: "题目选项",
      placeholder: "请输入题目选项",
    },
    {
      field: 'answer',
      type: 'select',
      label: '题目答案',
      placeholder: '请选择题目答案',
      options: [],
      otherOptions:{
        multiple:true
      },
      rules: [
        {
          required: true,
          message: '请选择题目答案',
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
      field: "content",
      type: "input",
      label: "题目内容",
      placeholder: "请输入题目内容",
      rules: [
        {
          required: true,
          message: "请输入题目内容",
          trigger: "blur",
        },
      ],
      otherOptions: {
        disabled: true
      }
    },
    {
      field: "options",
      type: "customAdd",
      dataType:'array',
      label: "题目选项",
      placeholder: "请输入题目选项",
      otherOptions: {
        disabled: true
      }
    },
    {
      field: 'answer',
      type: 'select',
      label: '题目答案',
      placeholder: '请选择题目答案',
      options: [],
      otherOptions:{
        multiple:true,
        disabled:true
      },
      rules: [
        {
          required: true,
          message: '请选择题目答案',
          trigger: 'change',
        },
      ]
    },
  ],
  labelWidth: "90px",
};
export {
  addDialogConfig,
  editDialogConfig,
  detailDialogConfig
};
