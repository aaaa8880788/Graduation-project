import { IForm } from "@/components/page-dialog/type";
import localCache from '@/utils/local-cache'

const addDialogConfig: IForm = {
  formItems: [
    {
      field: "content",
      type: "input",
      label: "评论内容",
      placeholder: "请输入评论内容",
      otherOptions:{
        type:'textarea',
        autosize:{ 
          minRows: 3
        }
      }
    }
  ],
  labelWidth: "90px",
};
const editDialogConfig: IForm = {
  formItems: [
    {
      field: "content",
      type: "input",
      label: "评论内容",
      placeholder: "请输入评论内容",
      otherOptions:{
        type:'textarea',
        autosize:{ 
          minRows: 3
        }
      }
    }
  ],
  labelWidth: "90px",
};
const detailDialogConfig: IForm = {
  formItems: [
    {
      field: "content",
      type: "input",
      label: "评论内容",
      placeholder: "请输入评论内容",
      otherOptions:{
        type:'textarea',
        autosize:{ 
          minRows: 3
        },
        disabled:true
      }
    }
  ],
  labelWidth: "90px",
};
export {
  addDialogConfig,
  editDialogConfig,
  detailDialogConfig
};
