<template>
  <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      top="3vw"
      width="40%"
      center
      destroy-on-close
      @closed="closeHandle">
    <h1>{{ title }}</h1>
    <el-tree 
      ref="treeRef"
      show-checkbox
      highlight-current
      node-key="id"
      :data="treeData"
      :props="defaultProps"
      @check="checkChangeHandle"/>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeBtnClick">
          取消
        </el-button>
        <el-button 
          type="primary" 
          @click="confirmBtnClick">
            确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { ElTree } from 'element-plus'

interface Props {
  dialogTitle?: string; //对话框标题
  title?: string;
  treeData:[],
  treeSelectData?:[]
}

// 定义属性
const props = withDefaults(defineProps<Props>(), {
  dialogTitle: "默认标题",
  title: "权限分配",
  treeData: () => [],
  treeSelectData: () => []
});

const defaultProps = {
  children: 'children',
  label: 'label',
}
const emit = defineEmits<{
  (e: "dialogConfirmClick",powerData:object[]): void;
}>();

// 对话框显示状态
const dialogVisible = ref(false)
// 选中权限列表
const powersSelectedList = ref<object[]>([])
// 权限树ref对象
const treeRef = ref<InstanceType<typeof ElTree>>()

// 定义方法

// 关闭弹窗方法
const closeHandle = () => {
  dialogVisible.value = false
}
// 取消按钮点击触发
const closeBtnClick = () => {
  dialogVisible.value = false
}
// 确定按钮点击触发
const confirmBtnClick = () => {
  emit("dialogConfirmClick",[...powersSelectedList.value]);
}
// 树节点选中处理函数
const checkChangeHandle = (data1: any, data2: any) => {
  const result = [...data2.checkedNodes]
  let arr:object[] = []
  result.forEach(item => {
    if(!item.children){
      arr = Array.from(new Set([
        ...arr,
        {
          id:item.id,
          name:item.name,
          type:item.type,
          powerName:item.powerName,
          moment:item.moment,
        }
      ]))
    }
  })
  powersSelectedList.value = arr
}
const setCheckedKeys = (powerList:any[]) => { 
  nextTick(()=>{
    const PowerListData:object[] = []
    powerList.forEach(item => {
      PowerListData.push(item.id)
    })
    treeRef.value?.setCheckedKeys(PowerListData, false) 
  })
}

// 暴露
defineExpose({
  dialogVisible,
  setCheckedKeys
});


</script>
<style lang="less">
  
</style>