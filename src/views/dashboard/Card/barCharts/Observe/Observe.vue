<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">

        <Search />

      </el-col>
      <el-col :span="12">

        <Category />

      </el-col>
    </el-row>

  </div>
</template>

<script>
import Category from '@/views/dashboard/Card/barCharts/Observe/Category'
import Search from '@/views/dashboard/Card/barCharts/Observe/Search'
export default {
  name: '',
  components: {
    Category,
    Search
  }
}
</script>

<style>

</style>
