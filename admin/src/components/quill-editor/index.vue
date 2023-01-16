<template>
    <el-upload
      ref="myElUpload"
      class="editor-img-uploader"
      :action="action"
      :show-file-list="false"
      :headers="headers"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <i class="el-icon-plus editor-img-uploader">
      </i>
    </el-upload>
    <QuillEditor 
      ref="myQuillEditor"
      id="editorId"
      :content="content"
      :contentType="contentType"
      :placeholder="readOnly ? '' : placeholder"
      :readOnly="readOnly"
      :options="options"
      @update:content="contentChangeHandle" />
</template>

<script setup lang="ts">
import { reactive,ref,toRaw,watch } from 'vue'
import type { UploadProps } from "element-plus";
import { ElMessage } from "element-plus";
// 导入富文本
import { QuillEditor,Quill } from '@vueup/vue-quill'
import type { Delta } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// 定义类型
interface Props {
  content: string | Delta; 
  placeholder?:string;
  contentType?: "html" | "delta" | "text" | undefined
  action:any
  headers:any
  readOnly?:boolean
}

// 定义属性
const props = withDefaults(defineProps<Props>(), {
  content:"",
  placeholder: "请输入内容",
  contentType: "html",
  readOnly:false
});

const emit = defineEmits<{
  (e: "update:content", content: any): void;
}>();

const myQuillEditor=ref<any>(null)
const myElUpload=ref<any>(null)
const options = reactive({
      modules: {
        toolbar: {
          container: [
            [{ size: ["small", false, "large"] }],
            ["bold", "italic", "underline"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            [{ color: [] }, { background: [] }],
            [{ align: [] }]
          ],
          handlers: {
            image: function (value:any) {
              if (value) {
                if(!myElUpload.value){
                  return
                }
                // 调用element图片上传
                document.querySelector(".editor-img-uploader>.el-upload")?.click();
              } else {
                Quill.format("image", true);
              }
            },
          },
        },
        history: {
          delay: 1000,
          maxStack: 50,
          userOnly: false
        },
      },
});

let readOnlyStyle = {
  backgroundColor: '#f5f7fa',
  cursor:'no-drop'
}
if(!props.readOnly){
  readOnlyStyle = {
    backgroundColor: '',
    cursor: ''
  }
}


// 定义方法
const contentChangeHandle = (content:Delta) => {
  emit("update:content", content);
}

// 图片上传成功后处理函数
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  if(response.code === 200){
    if(!myQuillEditor.value){
      return
    }
    const imageUrl = response.data.url;
    // 获取富文本实例
    let quill = toRaw(myQuillEditor.value)!.getQuill();
    // 获取光标位置
    let length = quill.selection.savedRange.index;
    // 插入图片，res为服务器返回的图片链接地址
    quill.insertEmbed(length, "image", imageUrl);
    // 调整光标到最后
    quill.setSelection(length + 1);
  }else{
    ElMessage({
          message: "提交失败！",
          type: "error",
    });
  }
};
// 图片点击之前的处理函数
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("上传的图片格式只能是image/jpeg类型");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("图片上传大小不可超过2m");
    return false;
  }
  return true;
};

</script>
<style scoped>
.editor-img-uploader {
  display: none;
}
.ql-editor {
  min-height: 300px;
}
</style>
<style>
.ql-toolbar.ql-snow,.ql-toolbar.ql-snow + .ql-container.ql-snow {
  width: 100%;
}
#editorId {
  background-color: v-bind('readOnlyStyle.backgroundColor');
  cursor:v-bind('readOnlyStyle.cursor');
}
</style>