import { IForm } from "@/components/form/type";
const searchFormConfig: IForm = {
  formItems: [
    {
      field: 'name',
      type: 'input',
      label: '用户名',
      placeholder: '请输入用户名',
    },
    {
      field: 'title',
      type: 'input',
      label: '别名',
      placeholder: '请输入别名'
    },
    {
      field: 'type',
      type: 'select',
      label: '用户类型',
      placeholder: '请选择用户类型',
      options: [
        { label: '超级管理员', value: 0, key:0 },
        { label: '教师', value: 1, key:1 }
      ]
    },
    {
      field: 'moment',
      type: 'datepicker',
      label: '创建时间',
      otherOptions: {
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        type: 'daterange'
      }
    }
  ],
  labelWidth: '120px'
}

export {
  searchFormConfig
}