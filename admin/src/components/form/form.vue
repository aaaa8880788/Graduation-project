<template>
  <div class="header">
    <slot name="header"> </slot>
  </div>
  <el-form :label-width="labelWidth" ref="ruleFormRef" :model="modelValue">
    <el-row>
      <template v-for="item in formItems" :key="item.label">
        <el-col v-bind="itemColLayout">
          <el-form-item
            v-if="!item.isHidden"
            :label="item.label"
            :rules="item.rules"
            :style="itemStyle"
            :prop="item.field"
          >
            <template v-if="item.type === 'input' || item.type === 'password'">
              <el-input
                :placeholder="item.placeholder"
                :show-password="item.type === 'password'"
                :model-value="modelValue[`${item.field}`]"
                @update:modelValue="valueChange($event, item.field)"
                clearable
                v-bind="item.otherOptions"
              />
            </template>
            <template v-else-if="item.type === 'select'">
              <el-select
                :placeholder="item.placeholder"
                :model-value="modelValue[`${item.field}`]"
                @update:modelValue="valueChange($event, item.field)"
                style="width: 100%"
                clearable
                v-bind="item.otherOptions"
              >
                <el-option
                  v-for="option in item.options"
                  :key="option.value"
                  :value="option.value"
                  :label="option.label"
                >
                </el-option>
              </el-select>
            </template>
            <template v-else-if="item.type === 'datepicker'">
              <el-date-picker
                v-bind="item.otherOptions"
                :model-value="modelValue[`${item.field}`]"
                @update:modelValue="valueChange($event, item.field)"
              ></el-date-picker>
            </template>
            <template v-else-if="item.type === 'upload'">
              <el-upload
                class="avatar-uploader"
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
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
  <div class="footer">
    <slot name="footer"></slot>
  </div>
</template>

<script setup lang="ts">
import { IFormItem } from './type'
import { defineProps, withDefaults, ref, defineEmits, defineExpose } from 'vue'
import type { FormInstance } from 'element-plus'
import type { UploadProps } from 'element-plus'

// 定义属性
interface Props {
  formItems: IFormItem[] // 表单配置项,
  labelWidth?: string // 每个表单标题宽度
  itemStyle?: object // 每个表单样式
  itemColLayout?: object // 表单布局
  modelValue: any //绑定表单的每个数据
  isHidden?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  formItems: () => [],
  labelWidth: '120px',
  itemStyle: () => ({ padding: '10px 20px' }),
  itemColLayout: () => ({
    xl: 6, // >=1920px
    lg: 8, // >=1200px
    md: 12, // >=992px
    sm: 24, // >=768px
    xs: 24 // <768px
  })
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'changeSelected', value: any): void
  (e: 'handleUploadSuccess', response: any, uploadFile: any): void
  (e: 'handleUploadBeforeSuccess', rawFile: any): void
}>()

const ruleFormRef = ref<FormInstance>()

// 定义方法
const valueChange = (value: any, field: string) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

// 表单验证
const checkForm = async () => {
  if (!ruleFormRef.value) return
  const checkResult = await ruleFormRef.value.validate((valid) => {
    return valid
  })
  return checkResult
}

// 表单重置方法
const resetForm = () => {
  ruleFormRef.value?.resetFields()
}

// 图片上传成功处理函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  const uploadItem = props.formItems.find((item) => item.type === 'upload')
  const imageUrl = URL.createObjectURL(uploadFile.raw!)
  if (uploadItem) {
    emit('handleUploadSuccess', response, uploadFile)
    emit('update:modelValue', {
      ...props.modelValue,
      [uploadItem['field']]: imageUrl
    })
  }
}
// 图片上传前处理函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  emit('handleUploadBeforeSuccess', rawFile)
}

defineExpose({
  resetForm,
  checkForm,
  ruleFormRef
})
</script>

<style lang="less">
.el-form-item {
  margin-top: 18px;
}
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
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
}
</style>
