import { IForm } from "@/components/form/type";
const searchFormConfig: IForm = {
  formItems: [
    {
      field: 'status',
      type: 'select',
      label: '发货状态',
      placeholder: '请选择发货状态',
      options: [
        { label: '未发货', value: 0, key:0 },
        { label: '已发货', value: 1, key:1 },
        { label: '已完成', value: 2, key: 2 }
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