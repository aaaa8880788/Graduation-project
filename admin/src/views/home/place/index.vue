<template>
  <div class="admin">
    <el-scrollbar>
    <!-- 顶部搜索部分 -->
    <page-search 
      ref="pageSearchRef" 
      :searchFormConfig="searchFormConfig"
      :addBtnShow="permission.add"
      v-model:queryInfo="queryInfo"
      @resetBtnClick="resetClickhandle"
      @searchBtnClick="searchClickhandle"
      @addBtnClick="addClickHandle">
    </page-search>
    <!-- 顶部搜索部分 -->
    <!-- 表格部分 -->
    <page-table 
      ref="pageTableRef" 
      :tableData="tableData"
      v-bind="tableConfig" 
      v-model:pageInfo="pageInfo"
      :tableDataTotal="tableDataTotal" 
      @pageSizeChange="paginationHandle"
      @currentSizeChange="paginationHandle">
      <!-- 插槽部分处理 -->
      <!-- 使用状态列 -->
      <template #status="scope">
        <el-tag 
          v-if="scope.row.status === 0"
          type="danger">
          不可使用
        </el-tag>
        <el-tag v-else>
          可使用
        </el-tag>
      </template>
      <!-- 使用状态列 -->
      <!-- 时间列 -->
      <template #moment="scope">
        {{ formateString(String(scope.row.moment)) }}
      </template>
      <!-- 时间列 -->
      <!-- 操作列 -->
      <template #handle="scope">
          <el-tag 
            v-if="!permission.modify && !permission.delete"
            type="danger">
            不允许编辑
          </el-tag>
          <el-button
            v-if="permission.modify"
            type="primary" 
            size="small"
            :icon="Edit" 
            @click="editClickHandle(scope.row)">
              编辑
          </el-button>
          <el-button 
            v-if="permission.delete"
            type="danger" 
            :icon="Delete" 
            size="small"
            @click="deleteClickHandle(scope.row)">
              删除
          </el-button>
      </template>
      <!-- 操作列 -->
    </page-table>
    <!-- 表格部分 -->
    <!-- 对话框部分 -->
    <!-- 添加对话框 -->
    <page-dialog
      ref="addPageDialogRef"
      @dialogConfirmClick="addDialogConfirmHandle"
      v-bind="addDialogConfig"
      v-model="addDialogFormData"
      :dialogTitle="addDialogTitle"
    ></page-dialog>
    <!-- 添加对话框 -->
    <!-- 编辑对话框 -->
    <page-dialog
      ref="editPageDialogRef"
      @dialogConfirmClick="editDialogConfirmHandle"
      v-bind="editDialogConfig"
      v-model="editDialogFormData"
      :dialogTitle="editDialogTitle"
    ></page-dialog>
    <!-- 编辑对话框 -->
    <!-- 对话框部分 -->
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { Delete, Edit } from "@element-plus/icons-vue";
import { ref,computed } from "vue";
import pageSearch from "@/components/page-search/page-search.vue";
import pageTable from "@/components/page-table/page-table.vue";
import pageDialog from "@/components/page-dialog/page-dialog.vue";
// 导入Element Plus方法
import { ElMessage, ElMessageBox } from "element-plus";
// 导入搜索表单配置项
import { searchFormConfig } from './config/search-config'
// 表格配置项
import { tableConfig } from "./config/table-config";
// 对话框配置项
import { addDialogConfig,editDialogConfig } from "./config/dialog-config";
// 导入工具方法
import { gernarateFormData } from "@/utils/formData-gernarate";
import { formateString } from "@/utils/date-formate";
import { objRemoveNullHandle } from "@/hook/useObjHandle"
// 导入网络方法
import { getPlacesRequest,deletePlace,addPlace,updatePlace,findPlaceById } from "@/network/home";
// 导入pinia
import { useLoginStore } from "@/store/login";

// 定义类型
interface Permission{
  add?:boolean
  delete?:boolean
  modify?:boolean
  find?:boolean
}

// 定义属性
const useLogin = useLoginStore()
const permission = ref<Permission>({})
// 表格查询参数（用于网络请求与分页器）
const pageInfo = ref({
  page: 1,
  pageSize: 5,
});
// 表格数据
const tableData = ref([])
// 表格数据总数
const tableDataTotal = ref(0)
// 表格组件ref对象
const pageTableRef = ref<InstanceType<typeof pageTable>>();


// 搜索参数数据queryInfo，从接收到的搜索配置中取出各个field组成
const queryInfo = ref(gernarateFormData(searchFormConfig))
// 搜索组件ref对象
const pageSearchRef = ref<InstanceType<typeof pageSearch>>();


// 添加按钮对话框formData数据
const addDialogFormData = ref(gernarateFormData(addDialogConfig));
// 对话框标题
const addDialogTitle = ref("添加活动地点");
// 添加对话框组件ref对象
const addPageDialogRef = ref<InstanceType<typeof pageDialog>>();

// 编辑按钮对话框formData数据
const editDialogFormData = ref(gernarateFormData(editDialogConfig));
// 对话框标题
const editDialogTitle = ref("编辑活动地点");
// 编辑对话框组件ref对象
const editPageDialogRef = ref<InstanceType<typeof pageDialog>>();
// 编辑用户id
let editUserId = ref<number | string>('')

// 定义方法
// 重置按钮点击触发
const resetClickhandle = () => {
  getPageData(queryInfo.value);
}
// 搜索按钮点击触发
const searchClickhandle = () => {
  getPageData(queryInfo.value);
}
// 添加按钮点击触发
const addClickHandle = () => {
  // 重置表单数据
  addDialogFormData.value = gernarateFormData(addDialogConfig)
  if(addPageDialogRef.value){
    addPageDialogRef.value.dialogVisible = true
  }
}
// 编辑按钮点击触发
const editClickHandle = async(row:any) => {
  editUserId.value = row.id
  editDialogFormData.value = gernarateFormData(editDialogConfig)
  const result = await findPlaceById('/findPlaceById',editUserId.value)
  if(result.code === 200){
    for(const key in editDialogFormData.value){
      editDialogFormData.value[key] = result.data[key]
    }
    if(editPageDialogRef.value){
      editPageDialogRef.value.dialogVisible = true
    }
  }else{
    ElMessage({
      message: result.message,
      type: "error",
    });
  }
}
// 删除按钮点击触发
const deleteClickHandle = (row: any) => {
  ElMessageBox.confirm("是否确认删除", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    center: true,
  })
  .then(async () => {
      const reuslt = await deletePlace('/deletePlace',{
        id:row.id,
        type:row.type
      })
      if (reuslt.code === 200) {
        // 弹窗提示
        ElMessage({
          message: "删除成功~",
          type: "success",
        });
        getPageData(queryInfo.value);
      } else {
        ElMessage({
          message: reuslt.message,
          type: "error",
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消成功~",
      });
    });
};

// 添加对话框确定按钮点击触发
const addDialogConfirmHandle = async() => {
  if (!addPageDialogRef.value) return;
  const valid: any = await addPageDialogRef.value.validateForm();
  if (!valid) return;
  let res = await addPlace('/addPlace',{
    ...addDialogFormData.value
  })
  if (res.code === 200) {
    ElMessage({
      message: `${addDialogTitle.value}成功~`,
      type: "success",
    });
    getPageData(queryInfo.value);
    addPageDialogRef.value.dialogVisible = false;
  } else {
    ElMessage({
      message: res.message,
      type: "error",
    });
  }
}
// 编辑对话框确定按钮点击触发
const editDialogConfirmHandle = async() => {
  if (!editPageDialogRef.value) return;
  const valid: any = await editPageDialogRef.value.validateForm();
  if (!valid) return;
  let res = await updatePlace('/updatePlace',{
    ...editDialogFormData.value
  },editUserId.value)
  if (res.code === 200) {
    ElMessage({
      message: `${editDialogTitle.value}成功~`,
      type: "success",
    });
    getPageData(queryInfo.value);
    editPageDialogRef.value.dialogVisible = false;
  } else {
    ElMessage({
      message: res.message,
      type: "error",
    });
  }
}



// 分页器触发函数
const paginationHandle = () => {
  getPageData(queryInfo.value);
};
// 发送网络请求获取表单数据
const getPageData = async (queryInfo?: object) => {
  const newQueryInfo = objRemoveNullHandle(queryInfo)
  const result = await getPlacesRequest("/findPlaces", {
    page: pageInfo.value.page,
    pageSize: pageInfo.value.pageSize,
    queryInfo: newQueryInfo
  })
  if (result.code === 200) {
    tableData.value = result.data
    tableDataTotal.value = result.total
  }else{
    ElMessage({
      message: result.message,
      type: "error",
    });
  }
}

// 获取权限数据
const getPermission = () => {
  const menuList = useLogin.menuList
  const placeData = menuList.find(item => item.name === 'place')
  if(placeData){
    const obj:Record<string,boolean> = {}
    const permission:string[] = placeData.permission
    permission.forEach(item => {
      obj[item] = true
    })
    return obj
  }else{
    return {}
  }
}
// 获取权限数据
permission.value = getPermission()

// 获取列表数据
await getPageData(queryInfo.value);

</script>

<style scoped>
.admin {
  width: 100%;
}
</style>
