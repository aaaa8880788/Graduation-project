<template>
  <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      top="3vw"
      width="40%"
      center
      destroy-on-close
      @closed="closeHandle">
    <h1>前台权限</h1>
    <el-tree 
      ref="webTreeRef"
      show-checkbox
      highlight-current
      node-key="id"
      :data="webTreeData"
      :props="defaultProps"
      @check="webCheckChangeHandle"/>
    <h1>后台权限</h1>
    <el-tree 
      ref="adminTreeRef"
      show-checkbox
      highlight-current
      node-key="id"
      :data="adminTreeData"
      :props="defaultProps"
      @check="adminCheckChangeHandle"/>
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

interface Tree {
  id: number
  label: string
  moment?:string
  name?:string
  powerName?:string
  children?: Tree[]
}

interface Props {
  dialogTitle?: string; //对话框标题
  webTreeData?:[]
  adminTreeData?:[],
  treeSelectData?:[]
}

// 定义属性
const props = withDefaults(defineProps<Props>(), {
  dialogTitle: "默认标题",
  webTreeData: () => [],
  adminTreeData: () => [],
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
// 前台选中权限列表
const webPowersSelectedList = ref<object[]>([])
// 后台选中权限列表
const adminPowersSelectedList = ref<object[]>([])
// 前台权限树ref对象
const webTreeRef = ref<InstanceType<typeof ElTree>>()
// 后台权限树ref对象
const adminTreeRef = ref<InstanceType<typeof ElTree>>()

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
  emit("dialogConfirmClick",[...webPowersSelectedList.value,...adminPowersSelectedList.value]);
}
// 前台树节点选中处理函数
const webCheckChangeHandle = (data1: any, data2: any) => {
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
  webPowersSelectedList.value = arr
}
// 后台树节点选中处理函数
const adminCheckChangeHandle = (data1: any, data2: any) => {
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
  adminPowersSelectedList.value = arr
}
const setCheckedKeys = (powerList:any[]) => { 
  nextTick(()=>{
    const webPowerList:object[] = []
    const adminPowerList:object[] = []
    powerList.forEach(item => {
      if(item.type === 0){
        webPowerList.push(item.id)
      }else if(item.type === 1){
        adminPowerList.push(item.id)
      }
    })
    webTreeRef.value?.setCheckedKeys(webPowerList, false)
    adminTreeRef.value?.setCheckedKeys(adminPowerList, false) 
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