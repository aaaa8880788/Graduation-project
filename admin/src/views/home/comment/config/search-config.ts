import { IForm } from "@/components/form/type";
const searchFormConfig: IForm = {
  formItems: [
    {
      field: 'commentType',
      type: 'select',
      label: '评论类型',
      placeholder: '请选择评论类型',
      options: [
        { label: '文章', value: 0 , key: 0},
        { label: '视频', value: 1, key: 1 },
        { label: '活动', value: 2, key: 2 },
      ]
    },
    {
      field: 'status',
      type: 'select',
      label: '审核状态',
      placeholder: '请选择审核状态',
      options: [
        { label: '未审核', value: 0 , key: 0},
        { label: '审核通过', value: 1, key: 1 },
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