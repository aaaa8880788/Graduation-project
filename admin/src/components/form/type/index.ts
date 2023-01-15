type IFormType = 'input' | 'password' | 'select' | 'datepicker' | 'vedioUpload' | 'imageUpload' | 'quillEditor' | 'number' | 'customAdd'

interface IFormOption {
  label: string
  value: string | number
  key: string | number
  disabled?: boolean
}

export interface IFormItem {
  field: string //字段名
  type: IFormType //输入框类型
  dataType?: 'string' | 'number' | 'array'  //输入框返回数据类型
  label: string //输入框标题
  rules?: any[] //输入框验证规则
  placeholder?: any //输入框默认显示内容
  // 针对select
  options?: IFormOption[] //选择器的可选子选项
  // 针对特殊属性
  otherOptions?: any
  // 该行是否隐藏
  isHidden?: boolean
}

export interface IForm {
  formItems: IFormItem[]
  labelWidth?: string
  itemStyle?: any
  itemColLayout?: any
}
