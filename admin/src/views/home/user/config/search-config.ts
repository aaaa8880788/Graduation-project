import { IForm } from "@/components/form/type";
const searchFormConfig: IForm = {
  formItems: [
    {
      field: 'name',
      type: 'input',
      label: '姓名',
      placeholder: '请输入姓名',
    },
    {
      field: 'type',
      type: 'select',
      label: '用户类型',
      placeholder: '请选择用户类型',
      options: [
        { label: '学生', value: 0, key:0 },
        { label: '教师', value: 1, key:1 }
      ]
    },
    {
      field: 'cardId',
      type: 'input',
      label: '工号/学号',
      placeholder: '请输入工号/学号',
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