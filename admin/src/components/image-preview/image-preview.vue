<template>
  <div class="demo-image__preview">
    <el-image
      style="width: auto; height: 65px"
      :src="imageUrl"
      :preview-src-list="[imageUrl]"
      fit="fill"
      preview-teleported
      lazy
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  imageUrl: string;
}
const props = defineProps<Props>();
</script>

<style scoped>
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>
