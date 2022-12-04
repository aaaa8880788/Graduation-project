<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="40%"
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
                v-bind="item.otherOption"
                clearable
                :placeholder="item.placeholder"
              ></el-input>
            </template>
            <template v-if="item.type === 'select'">
              <el-select
                :modelValue="modelValue[`${item.field}`]"
                @update:modelValue="valueChange($event, item.field)"
                clearable
                v-bind="item.otherOption"
                :placeholder="item.placeholder"
                @change="selectValueChange($event, item.field)"
              >
                <el-option
                  v-for="option in item.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
            </template>
            <template v-if="item.type === 'datePicker'">
              <el-date-picker
                :modelValue="modelValue[`${item.field}`]"
                @update:modelValue="valueChange($event, item.field)"
                type="date"
                :placeholder="item.placeholder"
                v-bind="item.otherOption"
              />
            </template>
            <template v-if="item.type === 'upload'">
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                v-bind="item.otherOption"
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
interface Props {
  dialogTitle?: string; //对话框标题
  formItems: IFormItem[]; // 表单配置项
  labelWidth?: string; // 每个表单标题宽度
  modelValue: any; //绑定表单的每个数据
}
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
  const uploadItem = props.formItems.find((item) => item.type === "upload");
  const imageUrl = response.url;
  if (uploadItem) {
    emit("update:modelValue", {
      ...props.modelValue,
      [uploadItem["field"]]: imageUrl,
    });
  }
};
// 图片点击之前的处理函数
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
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
