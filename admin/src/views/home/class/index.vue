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
      <!-- 专业班级类型列 -->
      <template #classData="scope">
        <el-tag 
          v-if="scope.row.classData"
          v-for="item in scope.row.classData"
          style="margin: 0 5px;">
          {{ item }}
        </el-tag>
        <el-tag v-else>
          空
        </el-tag>
      </template>
      <!-- 专业班级类型列 -->
      <!-- 所属学院列 -->
      <template #facultyId="scope">
        <el-tag>
          {{ scope.row.facultyData?.name }}
        </el-tag>
      </template>
      <!-- 所属学院列 -->
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
            v-else
            type="primary" 
            size="small"
            :icon="View"
            @click="detailClickHandle(scope.row)">
            详情
          </el-button>
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
      v-bind="newAddDialogConfig"
      v-model="addDialogFormData"
      :dialogTitle="addDialogTitle"
    ></page-dialog>
    <!-- 添加对话框 -->
    <!-- 编辑对话框 -->
    <page-dialog
      ref="editPageDialogRef"
      @dialogConfirmClick="editDialogConfirmHandle"
      v-bind="newEditDialogConfig"
      v-model="editDialogFormData"
      :dialogTitle="editDialogTitle"
    ></page-dialog>
    <!-- 编辑对话框 -->
    <!-- 详情对话框 -->
    <page-dialog
      ref="detailPageDialogRef"
      @dialogConfirmClick="detailDialogConfirmHandle"
      v-bind="newDetailDialogConfig"
      v-model="detailDialogFormData"
      :dialogTitle="detailDialogTitle"
    ></page-dialog>
    <!-- 详情对话框 -->
    <!-- 对话框部分 -->
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { Delete, Edit, View } from "@element-plus/icons-vue";
import { ref,computed } from "vue";
import pageSearch from "@/components/page-search/page-search.vue";
import pageTable from "@/components/page-table/page-table.vue";
import pageDialog from "@/components/page-dialog/page-dialog.vue";
// 导入Element Plus方法
import { ElButton, ElMessage, ElMessageBox, ElScrollbar, ElTag } from "element-plus";
// 导入搜索表单配置项
import { searchFormConfig } from './config/search-config'
// 表格配置项
import { tableConfig } from "./config/table-config";
// 对话框配置项
import { addDialogConfig,editDialogConfig,detailDialogConfig } from "./config/dialog-config";
// 导入工具方法
import { gernarateFormData } from "@/utils/formData-gernarate";
import { formateString } from "@/utils/date-formate";
import { objRemoveNullHandle } from "@/hook/useObjHandle"
// 导入网络方法
import { getClassesRequest,deleteClass,addClass,updateClass,findClassById,getFacultiesRequest } from "@/network/home";
// 导入pinia
import { useLoginStore } from "@/store/login";

// 定义类型
interface Permission{
  add?:boolean
  delete?:boolean
  modify?:boolean
  find?:boolean
}

interface FacultyOptions{
  label:string,
  value:string,
  key:string
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

// 学院列表数据
const facultiesListData = ref([])


// 搜索参数数据queryInfo，从接收到的搜索配置中取出各个field组成
const queryInfo = ref(gernarateFormData(searchFormConfig))
// 搜索组件ref对象
const pageSearchRef = ref<InstanceType<typeof pageSearch>>();


// 添加按钮对话框formData数据
const addDialogFormData = ref(gernarateFormData(addDialogConfig));
// 对话框标题
const addDialogTitle = ref("添加班级");
// 添加对话框组件ref对象
const addPageDialogRef = ref<InstanceType<typeof pageDialog>>();
// 添加对话框配置项处理
const newAddDialogConfig = computed(() => {
  let options:FacultyOptions[] = []
  let config = addDialogConfig
  if(!facultiesListData.value.length){
    return config
  }
  facultiesListData.value.forEach((item:Record<string,any>) => {
    options.push({
      label:item.name,
      value:item.id,
      key:item.id
    })
  })
  const formItem = config.formItems.find(item => item.field === 'facultyId')
  if(formItem){
    formItem.options = options
  }
  return config
})

// 编辑按钮对话框formData数据
const editDialogFormData = ref(gernarateFormData(editDialogConfig));
// 对话框标题
const editDialogTitle = ref("编辑班级");
// 编辑对话框组件ref对象
const editPageDialogRef = ref<InstanceType<typeof pageDialog>>();
// 编辑用户id
let editUserId = ref<number | string>('')
// 编辑对话框配置项处理
const newEditDialogConfig = computed(() => {
  let options:FacultyOptions[] = []
  let config = editDialogConfig
  if(!facultiesListData.value.length){
    return config
  }
  facultiesListData.value.forEach((item:Record<string,any>) => {
    options.push({
      label:item.name,
      value:item.id,
      key:item.id
    })
  })
  const formItem = config.formItems.find(item => item.field === 'facultyId')
  if(formItem){
    formItem.options = options
  }
  return config
})

// 详情按钮对话框formData数据
const detailDialogFormData = ref(gernarateFormData(detailDialogConfig));
// 对话框标题
const detailDialogTitle = ref("详情");
// 详情对话框组件ref对象
const detailPageDialogRef = ref<InstanceType<typeof pageDialog>>();
// 详情用户id
let detailUserId = ref<number | string>('')
// 详情对话框配置项处理
const newDetailDialogConfig = computed(() => {
  let options:FacultyOptions[] = []
  let config = detailDialogConfig
  if(!facultiesListData.value.length){
    return config
  }
  facultiesListData.value.forEach((item:Record<string,any>) => {
    options.push({
      label:item.name,
      value:item.id,
      key:item.id
    })
  })
  const formItem = config.formItems.find(item => item.field === 'facultyId')
  if(formItem){
    formItem.options = options
  }
  return config
})

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
  const result = await findClassById('/findClassById',editUserId.value)
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
// 详情按钮点击触发
const detailClickHandle = async(row:any) => {
  detailUserId.value = row.id
  detailDialogFormData.value = gernarateFormData(detailDialogConfig)
  const result = await findClassById('/findClassById',detailUserId.value)
  if(result.code === 200){
    for(const key in detailDialogFormData.value){
      detailDialogFormData.value[key] = result.data[key]
    }
    if(detailPageDialogRef.value){
      detailPageDialogRef.value.dialogVisible = true
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
      const reuslt = await deleteClass('/deleteClass',{
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
  let res = await addClass('/addClass',{
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
  let res = await updateClass('/updateClass',{
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
// 详情对话框确定按钮点击触发
const detailDialogConfirmHandle = async() =>{
  if (!detailPageDialogRef.value) return;
  detailPageDialogRef.value.dialogVisible = false;
}
// 分页器触发函数
const paginationHandle = () => {
  getPageData(queryInfo.value);
};
// 发送网络请求获取表单数据
const getPageData = async (queryInfo?: object) => {
  const newQueryInfo = objRemoveNullHandle(queryInfo)
  const result = await getClassesRequest("/findClasses", {
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
// 发送网络请求获取学院列表数据
const getFaultiesListData = async() =>{
  const result = await getFacultiesRequest("/findFaculties", {
    page: 1,
    pageSize: 999,
  })
  if (result.code === 200) {
    facultiesListData.value = result.data
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
  const articleData = menuList.find(item => item.name === 'class')
  if(articleData){
    const obj:Record<string,boolean> = {}
    const permission:string[] = articleData.permission
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
// 获取学院列表数据
await getFaultiesListData()


</script>

<style scoped>
.admin {
  width: 100%;
}
</style>
