<template>
  <div class="page-search">
    <Bu-form 
      ref="BuFormRef"
      v-bind="searchFormConfig" 
      :modelValue="queryInfo"
      @update:modelValue="valueChange($event)">
      <template #header>
        <div class="header">
          <h1>高级检索</h1>
        </div>
      </template>
      <template #footer>
        <div class="footer">
          <el-button 
            type="primary" 
            :icon="Refresh" 
            @click="resetClick">
            重置
          </el-button>
          <el-button 
            type="primary" 
            :icon="Search" 
            @click="searchClick">
            搜索
          </el-button>
          <el-button 
            v-if="addBtnShow"
            type="primary" 
            :icon="CirclePlus" 
            @click="addClick">
            添加
          </el-button>
        </div>
      </template>
    </Bu-form>
  </div>
</template>

<script setup lang="ts">
import BuForm from '@/components/form/form.vue'
import { Search, Refresh,CirclePlus } from '@element-plus/icons-vue'
import { ref, defineProps, defineEmits } from 'vue'
import { IForm } from '@/components/form/type'

// 定义属性
interface Props {
  searchFormConfig: IForm
  queryInfo:any
  addBtnShow:boolean
}
const props = withDefaults(defineProps<Props>(),{
  addBtnShow:false
})
const emit = defineEmits<{
  (e: 'resetBtnClick'): void
  (e: 'addBtnClick'): void
  (e: 'searchBtnClick', formData: object): void
  (e: "update:queryInfo", val: any): void;
}>()
const BuFormRef = ref<InstanceType<typeof BuForm>>()

// 2.重置与搜索功能
// 重置按钮触发
const resetClick = () => {
  BuFormRef.value?.resetForm()
  emit('resetBtnClick')
}
// 搜索按钮触发
const searchClick = () => {
  // 这里需要遍历搜索配置项，配置项里可以传dataType，要求数据返回什么类型的数据
  props.searchFormConfig.formItems.map((item) => {
    if (item.dataType === 'number' && props.queryInfo[item.field]) {
      emit('update:queryInfo',Number(props.queryInfo[item.field]))
    }
  })
  emit('searchBtnClick', props.queryInfo)
}
// 添加按钮触发
const addClick = () => {
  emit('addBtnClick')
}
// 搜索值改变
const valueChange = (value: any) => {
  emit('update:queryInfo', value)
}
</script>

<style scoped>
.header {
  padding-top: 20px;
  text-align: center;
}
.footer {
  text-align: right;
  padding: 0 50px 20px 50px;
}
</style>
