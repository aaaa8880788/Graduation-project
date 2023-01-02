import { IForm } from "@/components/form/type";
const searchFormConfig: IForm = {
  formItems: [
    {
      field: 'name',
      type: 'input',
      label: '活动地点',
      placeholder: '活动地点',
    },
    {
      field: 'status',
      type: 'select',
      label: '使用状态',
      placeholder: '请选择使用状态',
      options: [
        { label: '不可使用', value: 0 , key: 0},
        { label: '可使用', value: 1, key: 0 }
      ]
    }
  ],
  labelWidth: '120px'
}

export {
  searchFormConfig
}