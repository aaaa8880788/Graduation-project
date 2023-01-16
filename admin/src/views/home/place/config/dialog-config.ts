import { IForm } from "@/components/page-dialog/type";

const addDialogConfig: IForm = {
  formItems: [
    {
      field: "name",
      type: "input",
      label: "地点名称",
      placeholder: "请输入地点名称",
      rules: [
        {
          required: true,
          message: "请输入地点名称",
          trigger: "blur",
        },
      ],
    },
    {
      field: "volume",
      type: "number",
      label: "容纳人数",
      dataType: 'number',
      placeholder: "请输入容纳人数",
      otherOptions:{
        min: 0
      },
      rules: [
        {
          required: true,
          message: "请输入容纳人数",
          trigger: "blur",
        }
      ],
    },
    {
      field: 'status',
      type: 'select',
      label: '使用状态',
      placeholder: '请选择使用状态',
      options: [
        { label: '不可使用', value: 0 , key: 0},
        { label: '可使用', value: 1, key: 1 }
      ],
      rules: [
        {
          required: true,
          message: '请选择使用状态',
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
      label: "地点名称",
      placeholder: "请输入地点名称",
      rules: [
        {
          required: true,
          message: "请输入地点名称",
          trigger: "blur",
        },
      ],
    },
    {
      field: "volume",
      type: "number",
      label: "容纳人数",
      dataType: 'number',
      placeholder: "请输入容纳人数",
      rules: [
        {
          required: true,
          message: "请输入容纳人数",
          trigger: "blur",
        },
      ],
    },
    {
      field: 'status',
      type: 'select',
      label: '使用状态',
      placeholder: '请选择使用状态',
      options: [
        { label: '不可使用', value: 0 , key: 0},
        { label: '可使用', value: 1, key: 1 }
      ],
      rules: [
        {
          required: true,
          message: '请选择使用状态',
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
      label: "地点名称",
      placeholder: "请输入地点名称",
      rules: [
        {
          required: true,
          message: "请输入地点名称",
          trigger: "blur",
        },
      ],
      otherOptions: {
        disabled: true
      }
    },
    {
      field: "volume",
      type: "number",
      label: "容纳人数",
      dataType: 'number',
      placeholder: "请输入容纳人数",
      rules: [
        {
          required: true,
          message: "请输入容纳人数",
          trigger: "blur",
        },
      ],
      otherOptions: {
        disabled: true
      }
    },
    {
      field: 'status',
      type: 'select',
      label: '使用状态',
      placeholder: '请选择使用状态',
      options: [
        { label: '不可使用', value: 0 , key: 0},
        { label: '可使用', value: 1, key: 1 }
      ],
      rules: [
        {
          required: true,
          message: '请选择使用状态',
          trigger: 'change',
        },
      ],
      otherOptions: {
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
