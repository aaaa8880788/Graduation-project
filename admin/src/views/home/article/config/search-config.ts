import { IForm } from "@/components/form/type";
const searchFormConfig: IForm = {
  formItems: [
    {
      field: 'title',
      type: 'input',
      label: '文章标题',
      placeholder: '请输入文章标题',
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