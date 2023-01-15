import { IForm } from "@/components/page-dialog/type";
import localCache from '@/utils/local-cache'

const addDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "姓名",
      placeholder: "请输入姓名",
      rules: [
        {
          required: true,
          message: "请输入姓名",
          trigger: "blur",
        },
      ],
    },
    {
      field: "cardId",
      type: "input",
      label: "工号/学号",
      placeholder: "请输入工号/学号",
      rules: [
        {
          required: true,
          message: "请输入工号/学号",
          trigger: "blur",
        },
      ],
    },
    {
      field: "phone",
      type: "input",
      label: "手机号",
      placeholder: "请输入手机号",
      rules: [
        {
          required: true,
          message: "请输入手机号",
          trigger: "blur",
        },
      ],
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
    },
    {
      field: "address",
      type: "input",
      label: "收货地址",
      placeholder: "请输入收货地址",
      otherOptions:{
        type:'textarea',
        autosize:{ 
          minRows: 3
        }
      }
    },
    {
      field: 'type',
      type: 'select',
      label: '用户类型',
      placeholder: '请选择用户类型',
      options: [
        { label: '学生', value: 0 , key: 0},
        { label: '教师', value: 1, key: 1 }
      ],
      rules: [
        {
          required: true,
          message: '请选择用户类型',
          trigger: 'change',
        },
      ],
    },
    {
      label: "头像",
      field: "avatar",
      type: "imageUpload",
      otherOptions: {
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
      }
    },
    {
      field: 'organizationId',
      type: 'select',
      label: '所属组织',
      placeholder: '请选择所属组织',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择所属组织',
          trigger: 'change',
        },
      ]
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
    {
      field: 'schoolId',
      type: 'select',
      label: '所属学校',
      placeholder: '请选择学校',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择学校',
          trigger: 'change',
        },
      ]
    },
    {
      field: 'classId',
      type: 'select',
      label: '所属专业',
      placeholder: '请选择专业',
      options: [],
    },
    {
      field: 'className',
      type: 'select',
      label: '所属班级',
      placeholder: '请选择班级',
      options: [],
    },
  ],
  labelWidth: "90px",
};
const editDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "姓名",
      placeholder: "请输入姓名",
      rules: [
        {
          required: true,
          message: "请输入姓名",
          trigger: "blur",
        },
      ],
    },
    {
      field: "cardId",
      type: "input",
      label: "工号/学号",
      placeholder: "请输入工号/学号",
      rules: [
        {
          required: true,
          message: "请输入工号/学号",
          trigger: "blur",
        },
      ],
    },
    {
      field: "phone",
      type: "input",
      label: "手机号",
      placeholder: "请输入手机号",
      rules: [
        {
          required: true,
          message: "请输入手机号",
          trigger: "blur",
        },
      ],
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
    },
    {
      field: "address",
      type: "input",
      label: "收货地址",
      placeholder: "请输入收货地址",
      otherOptions:{
        type:'textarea',
        autosize:{ 
          minRows: 3
        }
      }
    },
    {
      field: 'type',
      type: 'select',
      label: '用户类型',
      placeholder: '请选择用户类型',
      options: [
        { label: '学生', value: 0 , key: 0},
        { label: '教师', value: 1, key: 1 }
      ],
      rules: [
        {
          required: true,
          message: '请选择用户类型',
          trigger: 'change',
        },
      ],
    },
    {
      label: "头像",
      field: "avatar",
      type: "imageUpload",
      otherOptions: {
        action: import.meta.env.VITE_APP_IMAGE_URL,
        headers: {
          Authorization: localCache.getCache("token") || "",
        },
      }
    },
    {
      field: 'organizationId',
      type: 'select',
      label: '所属组织',
      placeholder: '请选择所属组织',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择所属组织',
          trigger: 'change',
        },
      ]
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
    {
      field: 'schoolId',
      type: 'select',
      label: '所属学校',
      placeholder: '请选择学校',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择学校',
          trigger: 'change',
        },
      ]
    },
    {
      field: 'classId',
      type: 'select',
      label: '所属专业',
      placeholder: '请选择专业',
      options: [],
    },
    {
      field: 'className',
      type: 'select',
      label: '所属班级',
      placeholder: '请选择班级',
      options: [],
    },
  ],
  labelWidth: "90px",
};

const detailDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "姓名",
      placeholder: "请输入姓名",
      rules: [
        {
          required: true,
          message: "请输入姓名",
          trigger: "blur",
        },
      ],
      otherOptions:{
        disabled:true
      }
    },
    {
      field: "cardId",
      type: "input",
      label: "工号/学号",
      placeholder: "请输入工号/学号",
      rules: [
        {
          required: true,
          message: "请输入工号/学号",
          trigger: "blur",
        },
      ],
      otherOptions:{
        disabled:true
      }
    },
    {
      field: "phone",
      type: "input",
      label: "手机号",
      placeholder: "请输入手机号",
      rules: [
        {
          required: true,
          message: "请输入手机号",
          trigger: "blur",
        },
      ],
      otherOptions:{
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
    },
    {
      field: "address",
      type: "input",
      label: "收货地址",
      placeholder: "请输入收货地址",
      otherOptions:{
        type:'textarea',
        autosize:{ 
          minRows: 3
        },
        disabled:true
      }
    },
    {
      field: 'type',
      type: 'select',
      label: '用户类型',
      placeholder: '请选择用户类型',
      options: [
        { label: '学生', value: 0 , key: 0},
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
    {
      label: "头像",
      field: "avatar",
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
      field: 'organizationId',
      type: 'select',
      label: '所属组织',
      placeholder: '请选择所属组织',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择所属组织',
          trigger: 'change',
        },
      ],
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
    {
      field: 'schoolId',
      type: 'select',
      label: '所属学校',
      placeholder: '请选择学校',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择学校',
          trigger: 'change',
        },
      ],
      otherOptions:{
        disabled:true
      }
    },
    {
      field: 'classId',
      type: 'select',
      label: '所属专业',
      placeholder: '请选择专业',
      options: [],
      otherOptions:{
        disabled:true
      }
    },
    {
      field: 'className',
      type: 'select',
      label: '所属班级',
      placeholder: '请选择班级',
      options: [],
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
