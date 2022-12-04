type formItemType = "input" | "select" | "upload" | "datePicker";
interface IFormOption {
  label: string;
  value: string | number;
}
export interface IFormItem {
  label: string;
  field: string;
  type: formItemType;
  placeholder?: string;
  // 其他配置
  otherOption?: object;
  // 针对select
  options?: IFormOption[]; //选择器的可选子选项
  rules?: any[]; //输入框验证规则
}

export interface IForm {
  formItems: IFormItem[];
  labelWidth?: string;
}
