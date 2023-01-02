<template>
  <div>
    <el-dialog
      top="7vh"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="80%"
      center
      destroy-on-close
      @closed="closeBtnClick"
    >      
      <div class="form">
        <el-form :model="modelValue" ref="formRef">
          <el-form-item
            :label-width="labelWidth"
            :label="item.label"
            v-for="item in formItems"
            :key="item.field"
            :rules="item.rules"
            :prop="item.field"
          >
            <template v-if="item.type === 'input'">
              <el-input
                :modelValue="modelValue[`${item.field}`]"
                @update:modelValue="valueChange($event, item.field)"
                v-bind="item.otherOptions"
                clearable
                :placeholder="item.placeholder"
              ></el-input>
            </template>
            <template v-if="item.type === 'number'">
              <el-input-number 
                :modelValue="modelValue[`${item.field}`]"
                @update:modelValue="valueChange($event, item.field)"
                v-bind="item.otherOptions" />
            </template>
            <template v-if="item.type === 'password'">
              <el-input
                type="password"
                show-password
                :modelValue="modelValue[`${item.field}`]"
                @update:modelValue="valueChange($event, item.field)"
                v-bind="item.otherOptions"
                :placeholder="item.placeholder"
              ></el-input>
            </template>
            <template v-if="item.type === 'select'">
              <el-select
                :modelValue="modelValue[`${item.field}`]"
                @update:modelValue="valueChange($event, item.field)"
                clearable
                v-bind="item.otherOptions"
                :placeholder="item.placeholder"
                @change="selectValueChange($event, item.field)"
              >
                <el-option
                  v-for="option in item.options"
                  :key="option.key"
                  :label="option.label"
                  :value="option.value"
                  :disabled="option.disabled"
                ></el-option>
              </el-select>
            </template>
            <template v-if="item.type === 'datepicker'">
              <el-date-picker
                :modelValue="modelValue[`${item.field}`]"
                @update:modelValue="valueChange($event, item.field)"
                type="date"
                :placeholder="item.placeholder"
                v-bind="item.otherOptions"
              />
            </template>
            <template v-if="item.type === 'upload'">
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                v-bind="item.otherOptions"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="modelValue[`${item.field}`]"
                  :src="modelValue[`${item.field}`]"
                  class="avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </template>
            <template v-if="item.type === 'quillEditor'">
              <quillEditor
                v-bind="item.otherOptions"
                :placeholder="item.placeholder"
                :content="modelValue[`${item.field}`]"
                @update:content="valueChange($event, item.field)" />
            </template>
            <template v-if="item.type === 'customAdd'">
              <div style="width: 100%;">
                <el-row>
                  <el-button 
                  type="primary"
                  style="margin-bottom: 10px;"
                  round
                  @click="addBtnClickHandle(item.field)">
                  添加选项
                  </el-button>
                </el-row>
                <el-row
                  v-for="(item1,index) in modelValue[`${item.field}`]"
                  :key="index">
                  <el-col :span="2">
                    <el-tag>{{ transformNum(index) }}</el-tag>
                  </el-col>
                  <el-col :span="20">
                    <el-input 
                      style="width: 95%;"
                      :modelValue="item1"
                      @update:modelValue="customAddValueChangeHandle($event,item.field,index)"
                    ></el-input>
                  </el-col>
                  <el-col :span="2">
                    <el-button 
                      type="danger"
                      size="small"
                      @click="deleteBtnClickHandle(item.field,index)">
                      删除
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeBtnClick">取消</el-button>
          <el-button type="primary" @click="confirmBtnClick">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { IFormItem } from "./type";
import { ref } from "vue";
import type { UploadProps } from "element-plus";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import quillEditor from '@/components/quill-editor/index.vue'

// 定义类型
interface Props {
  dialogTitle?: string; //对话框标题
  formItems: IFormItem[]; // 表单配置项
  labelWidth?: string; // 每个表单标题宽度
  modelValue: any; //绑定表单的每个数据
}

// 定义属性
const props = withDefaults(defineProps<Props>(), {
  dialogTitle: "默认标题",
  labelWidth: "70px",
});

const emit = defineEmits<{
  (e: "dialogConfirmClick"): void;
  (e: "update:modelValue", value: any): void;
  (e: "selectValueChange", value: any, field: string): void;
}>();

// 对话框显示状态
const dialogVisible = ref(false);

// 表单的ref对象
const formRef = ref<FormInstance>();


// 定义方法
// 双向绑定值改变触发函数
const valueChange = (value: any, field: any) => {
  emit("update:modelValue", { ...props.modelValue, [field]: value });
};

// 对话框关闭按钮处理函数
const closeBtnClick = () => {
  dialogVisible.value = false;
};
// 对话框确认按钮处理函数
const confirmBtnClick = () => {
  emit("dialogConfirmClick");
};

// 图片上传成功后处理函数
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  if(response.code === 200){
    const uploadItem = props.formItems.find((item) => item.type === "upload");
    const imageUrl = response.data.url;
    if (uploadItem) {
      emit("update:modelValue", {
        ...props.modelValue,
        [uploadItem["field"]]: imageUrl,
      });
    }
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

// 表单验证方法
const validateForm = async () => {
  if (formRef.value) {
    const result = await formRef.value?.validate((valid, fields) => {
      if (valid) {
        return true;
      } else {
        ElMessage.error("请输入合法信息");
        return false;
      }
    });
    return result;
  }
};

// 选择器值变化处理函数
const selectValueChange = (val: any, field: string) => {
  emit("selectValueChange", val, field);
};

// 添加按钮点击触发
const addBtnClickHandle = (field:string) => {
  let formData = { ...props.modelValue }
  if(formData[field].length === 4){
    return ElMessage.warning("最多四个选项");
  }
  formData[field].push('')
  emit("update:modelValue", formData);
}

// 删除按钮点击触发
const deleteBtnClickHandle = (field:string,index:number) => {
  let formData = { ...props.modelValue,[field]:[...props.modelValue[field]] }
  formData[field].splice(index,1)
  emit("update:modelValue", formData);
}

// 数字字母转化方法
const transformNum = (index:number) => {
  switch (index) {
    case 0:
      return 'A'
    case 1:
      return 'B'
    case 2:
      return 'C'
    case 3:
      return 'D'
  }
}

const customAddValueChangeHandle = (changeValue:string,field:string,index:number) => {
  let formData = { ...props.modelValue,[field]:[...props.modelValue[field]] }
  formData[field][index] = changeValue
  emit("update:modelValue", formData);
}

defineExpose({
  dialogVisible,
  formRef,
  validateForm,
});
</script>

<style scoped lang="less">
.el-select {
  width: 100%;
}
.avatar-uploader .avatar {
  width: auto;
  height: 80px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  text-align: center;
}
</style>
