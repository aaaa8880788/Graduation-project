import { IForm } from "@/components/form/type";
const searchFormConfig: IForm = {
  formItems: [
    {
      field: 'content',
      type: 'input',
      label: '题目内容',
      placeholder: '请输入题目内容',
    },
    {
      field: 'type',
      type: 'select',
      label: '题目类型',
      placeholder: '请选择题目类型',
      options: [
        { label: '单选', value: 0, key:0 },
        { label: '多选', value: 1, key:1 }
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