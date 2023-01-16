import { IForm } from "@/components/page-dialog/type";
import localCache from '@/utils/local-cache'

const addDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "专业名称",
      placeholder: "请输入专业名称",
      rules: [
        {
          required: true,
          message: "请输入专业名称",
          trigger: "blur",
        },
      ],
    },
    {
      field: "title",
      type: "input",
      label: "专业简称",
      placeholder: "请输入专业简称",
      rules: [
        {
          required: true,
          message: "请输入专业简称",
          trigger: "blur",
        },
      ],
    },
    {
      field: "classData",
      type: "customAdd",
      dataType: "array",
      label: "开设班级",
      placeholder: "请输入班级名称",
    },
    {
      field: 'facultyId',
      type: 'select',
      label: '所属院系',
      placeholder: '请选择院系',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择院系',
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
      label: "专业名称",
      placeholder: "请输入专业名称",
      rules: [
        {
          required: true,
          message: "请输入专业名称",
          trigger: "blur",
        },
      ],
    },
    {
      field: "title",
      type: "input",
      label: "专业简称",
      placeholder: "请输入专业简称",
      rules: [
        {
          required: true,
          message: "请输入专业简称",
          trigger: "blur",
        },
      ],
    },
    {
      field: "classData",
      type: "customAdd",
      dataType: "array",
      label: "开设班级",
      placeholder: "请输入班级名称",
    },
    {
      field: 'facultyId',
      type: 'select',
      label: '所属院系',
      placeholder: '请选择院系',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择院系',
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
      label: "专业名称",
      placeholder: "请输入专业名称",
      rules: [
        {
          required: true,
          message: "请输入专业名称",
          trigger: "blur",
        },
      ],
      otherOptions:{
        disabled:true
      }
    },
    {
      field: "title",
      type: "input",
      label: "专业简称",
      placeholder: "请输入专业简称",
      rules: [
        {
          required: true,
          message: "请输入专业简称",
          trigger: "blur",
        },
      ],
      otherOptions:{
        disabled:true
      }
    },
    {
      field: "classData",
      type: "customAdd",
      dataType: "array",
      label: "开设班级",
      placeholder: "请输入班级名称",
      otherOptions:{
        disabled:true
      }
    },
    {
      field: 'facultyId',
      type: 'select',
      label: '所属院系',
      placeholder: '请选择院系',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择院系',
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
  editDialogConfig,
  detailDialogConfig
};
