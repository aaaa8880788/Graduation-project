<template>
  <div class="tabel" :style="tableStyle">
    <el-table :data="tableData" border>
      <!-- 传入showSelectColumn时展示的全选列 -->
      <template v-if="showSelectColumn">
        <el-table-column type="selection" align="center" width="60" />
      </template>
      <!-- 传入showIndexColumn时展示的序号列 -->
      <template v-if="showIndexColumn">
        <el-table-column type="index" label="序号" align="center" width="60" />
      </template>
      <!-- propList配置项里面的所有列 -->
      <template v-for="item in propList" :key="item.prop">
        <el-table-column v-bind="item" show-overflow-tooltip>
          <!-- 如果有传slotName，则用插槽 -->
          <template #default="scope" v-if="item.slotName">
            <slot :row="scope.row" :name="item.slotName"></slot>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="footer" :style="footerStyle">
      <!-- 默认为一个分页器 -->
      <slot>
        <el-pagination
          :currentPage="pageInfo.currentPage"
          @update:currentPage="valueChange($event, 'currentPage')"
          :pageSize="pageInfo.pageSize"
          @update:pageSize="valueChange($event, 'pageSize')"
          :page-sizes="[5, 10, 15, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableDataTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ITableOption } from "./type";
// 定义属性
interface Props {
  tableStyle?: any;
  propList: ITableOption[]; //表单配置项
  tableData: any[];
  showIndexColumn?: boolean; //是否展示索引列
  showSelectColumn?: boolean; //是否展示索引列
  footerStyle?: any;
  tableDataTotal?: number;
  pageInfo?: any;
}
const props = withDefaults(defineProps<Props>(), {
  tableStyle: () => ({
    margin: "0 40px",
  }),
  showIndexColumn: false,
  showSelectColumn: false,
  footerStyle: () => ({
    display: "flex",
    justifyContent: "end",
    marginTop: "10px",
  }),
});
const emit = defineEmits<{
  (e: "pageSizeChange"): void;
  (e: "currentSizeChange"): void;
  (e: "update:pageInfo", val: any): void;
}>();
// 分页器处理函数
const handleSizeChange = () => {
  emit("pageSizeChange");
};
const handleCurrentChange = () => {
  emit("currentSizeChange");
};
const valueChange = (val: any, type: string) => {
  emit("update:pageInfo", { ...props.pageInfo, [type]: val });
};
</script>

<style scoped></style>
