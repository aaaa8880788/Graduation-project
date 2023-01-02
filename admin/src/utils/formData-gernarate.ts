import { IForm } from "@/components/form/type";
export function gernarateFormData(FormConfig: IForm) {
  // 1.从接收到的配置中取出各个field,组成表单的数据formData
  const formItems = FormConfig.formItems ?? [];
  const formData: any = {};
  formItems.map((item) => {
    if(item.dataType === 'number'){
      return formData[item.field] = 0;
    }
    if(item.dataType === 'array'){
      return formData[item.field] = [];
    }
    formData[item.field] = "";
  });
  return formData;
}
