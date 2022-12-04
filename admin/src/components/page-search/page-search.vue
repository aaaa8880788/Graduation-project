<template>
  <el-form :style="formStyle">
    <el-form-item :style="itemStyle">
      <el-input
        :placeholder="placeholder"
        style="width: 100%; height: 100%"
        :model-value="modelValue"
        @update:modelValue="valueChange($event)"
        clearable
        @clear="clearHandle"
      >
        <template #append>
          <el-button
            :icon="Search"
            style="height: 100%"
            @click="searchBtnHandler"
            >搜索</el-button
          >
        </template>
      </el-input>
    </el-form-item>
    <el-button type="primary" @click="addBtnHandler">{{
      buttonText
    }}</el-button>
  </el-form>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
interface Props {
  placeholder?: string;
  itemStyle?: any;
  buttonText?: string;
  formStyle?: any;
  modelValue: string; //绑定表单的每个数据
}
const props = withDefaults(defineProps<Props>(), {
  placeholder: "请输入用户名",
  itemStyle: () => ({
    height: "40px",
    width: "50%",
    marginRight: "40px",
  }),
  buttonText: "添加用户",
  formStyle: () => ({
    display: "flex",
    "align-items": "center",
    "justify-content": "center",
    margin: "50px",
  }),
  inputClearable: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "searchBtnClick"): void;
  (e: "addBtnClick"): void;
  (e: "clearBtnClick"): void;
}>();

// 定义方法
// 双向绑定方法
const valueChange = (value: any) => {
  emit("update:modelValue", value);
};
// 搜索按钮点击
const searchBtnHandler = () => {
  emit("searchBtnClick");
};
// 添加按钮点击
const addBtnHandler = () => {
  emit("addBtnClick");
};
// 输入框清空点击
const clearHandle = () => {
  emit("clearBtnClick");
};
</script>

<style lang="less" scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
