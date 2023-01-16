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
      <!-- 头像列 -->
      <template #avatar="scope">
        <imagePreview 
          v-if="scope.row.avatar"
          :imageUrl="scope.row.avatar" />
        <img
          v-else 
          style="width: auto; height: 30px"
          src="@/assets/image/user_head.png" />
      </template>
      <!-- 头像列 -->
      <!-- 类型列 -->
      <template #type="scope">
        <el-tag v-if="scope.row.type === 0">
          超级管理员
        </el-tag>
        <el-tag v-else>
          教师
        </el-tag>
      </template>
      <!-- 类型列 -->
      <!-- 时间列 -->
      <template #createAt="scope">
        {{ formateString(String(scope.row.moment)) }}
      </template>
      <!-- 时间列 -->
      <!-- 操作列 -->
      <template #handle="scope">
        <template v-if="scope.row.type === 0">
          <el-tag type="danger">
            不允许编辑
        </el-tag>
        </template>
        <template v-else>
          <el-tag 
            v-if="!permission.power && !permission.modify && !permission.delete"
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
            v-if="permission.power"
            type="primary" 
            size="small"
            :icon="Setting" 
            @click="powerClickHandle(scope.row)">
              权限
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
    <!-- 权限分配对话框 -->
    <power-select
      ref="powerPageDialogRef"
      @dialogConfirmClick="powerDialogConfirmHandle"
      title="后台权限"
      :treeData="powerTreeList"
      :dialogTitle="powerDialogTitle"
    ></power-select>
    <!-- 权限分配对话框 -->
    <!-- 详情对话框 -->
    <page-dialog
      ref="detailPageDialogRef"
      @dialogConfirmClick="detailDialogConfirmHandle"
      v-bind="detailDialogConfig"
      v-model="detailDialogFormData"
      :dialogTitle="detailDialogTitle"
    ></page-dialog>
    <!-- 详情对话框 -->
    <!-- 对话框部分 -->
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { Delete, Edit , Setting, View} from "@element-plus/icons-vue";
import { ref } from "vue";
import pageSearch from "@/components/page-search/page-search.vue";
import pageTable from "@/components/page-table/page-table.vue";
import pageDialog from "@/components/page-dialog/page-dialog.vue";
import imagePreview from "@/components/image-preview/image-preview.vue";
import powerSelect from "@/components/power-select/index.vue"
// 导入Element Plus方法
import { ElMessage, ElMessageBox } from "element-plus";
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
import { transFormPowerName } from "@/utils";
// 导入网络方法
import { getManagersRequest,deleteManager,addManager,updateManager,findManagerById,findPowers } from "@/network/home";
// 导入pinia
import { useLoginStore } from "@/store/login";

// 定义类型
interface Permission{
  add?:boolean
  delete?:boolean
  modify?:boolean
  find?:boolean
  power?:boolean
}

// 定义属性
// 表格查询参数（用于网络请求与分页器）
const useLogin = useLoginStore()
const permission = ref<Permission>({})
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
const addDialogTitle = ref("添加管理员");
// 添加对话框组件ref对象
const addPageDialogRef = ref<InstanceType<typeof pageDialog>>();

// 编辑按钮对话框formData数据
const editDialogFormData = ref(gernarateFormData(editDialogConfig));
// 对话框标题
const editDialogTitle = ref("编辑管理员");
// 编辑对话框组件ref对象
const editPageDialogRef = ref<InstanceType<typeof pageDialog>>();
// 编辑用户id
let editUserId = ref<number | string>('')

// 详情按钮对话框formData数据
const detailDialogFormData = ref(gernarateFormData(detailDialogConfig));
// 对话框标题
const detailDialogTitle = ref("详情");
// 详情对话框组件ref对象
const detailPageDialogRef = ref<InstanceType<typeof pageDialog>>();
// 详情用户id
let detailUserId = ref<number | string>('')

// 对话框标题
const powerDialogTitle = ref("分配管理员权限");
// 权限对话框组件ref对象
const powerPageDialogRef = ref<InstanceType<typeof powerSelect>>();
// 权限数据
const powerTreeList = ref<[]>([])



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
  const result = await findManagerById('/findManagerbyId',editUserId.value)
  if(result.code === 200){
    for(const key in editDialogFormData.value){
      if(result.data[key]){
        editDialogFormData.value[key] = result.data[key]
      }
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
  const result = await findManagerById('/findManagerbyId',detailUserId.value)
  if(result.code === 200){
    for(const key in detailDialogFormData.value){
      if(result.data[key]){
        detailDialogFormData.value[key] = result.data[key]
      }
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
      const reuslt = await deleteManager('/deleteManger',{
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
// 权限按钮点击触发
const powerClickHandle = async(row:any) => {
  const currentPower:any[] = row.powerId
  editUserId.value = row.id
  const result = await findPowers('/findpowers')
  if(result.code === 200){
    const powerList = [...result.data]
    let arr:any = []
    powerList.forEach(power => {
        if(power.type === 1){
        const fatherNode = arr.find((item3: { label: any; }) => item3.label === transFormPowerName(power.name))
        if(fatherNode){
          fatherNode.children.push({
            ...power,
            label:transFormPowerName(power.powerName)
          })
        }else{
          arr.push({
            id:Number(power.moment),
            label:transFormPowerName(power.name),
            children:[
              {
                ...power,
                label:transFormPowerName(power.powerName)
              }
            ]
          })
        }
      }
    
    })
    powerTreeList.value = arr
    if(powerPageDialogRef.value){
      powerPageDialogRef.value.dialogVisible = true
      powerPageDialogRef.value.setCheckedKeys(currentPower)
    }
  }  
}
// 添加对话框确定按钮点击触发
const addDialogConfirmHandle = async() => {
  if (!addPageDialogRef.value) return;
  const valid: any = await addPageDialogRef.value.validateForm();
  if (!valid) return;
  let res = await addManager('/addManager',{
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
  let res = await updateManager('/updateManager',{
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
// 权限对话框确定按钮点击触发
const powerDialogConfirmHandle = async(powerList:object[]) => {
  if (!powerPageDialogRef.value) return;;
  let res = await updateManager('/updateManager',{
    powerId:powerList
  },editUserId.value)
  if (res.code === 200) {
    ElMessage({
      message: `${powerDialogTitle.value}成功~`,
      type: "success",
    });
    getPageData(queryInfo.value);
    powerPageDialogRef.value.dialogVisible = false;
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
  const result = await getManagersRequest("/findMangers", {
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
  const managerData = menuList.find(item => item.name === 'manager')
  if(managerData){
    const obj:Record<string,boolean> = {}
    const permission:string[] = managerData.permission
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
