<template>
  <div>
    <!-- inline代表行内表单 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">

      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" :disabled="show" @change="handler1">
          <el-option v-for="(c1,index) in list1" :key="c1.id" :label="c1.name" :value="c1.id" />

        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" :disabled="show" @change="handler2">
          <el-option v-for="(c2,index) in list2" :key="c2.id" :label="c2.name" :value="c2.id" />

        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" :disabled="show" @change="handler3">
          <el-option v-for="(c3,index) in list3" :key="c3.id" :label="c3.name" :value="c3.id" />

        </el-select>
      </el-form-item>

    </el-form></div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      // 一级分类数据
      list1: [],
      // 二级分类数据
      list2: [],
      // 三级分类数据
      list3: [],
      // 收集相应的一级二级三级分类的ID
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  // 当组件挂载完毕，向服务器发请求，获取相应的一级分类数据
  mounted() {
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类的方法
    async getCategory1List() {
      // 无需携带参数
      const result = await this.$API.attr.reqCategory1List()

      if (result.code == 200) {
        this.list1 = result.data
      }
    },
    // 一级分类select事件的回调
    async handler1() {
      // 清除数据
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      // 解构出一级 分类的Id
      const { category1Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      // 通过一级分类的ID获取二级分类的数据
      const result = await this.$API.attr.reqCategory2List(category1Id)
      if (result.code == 200) {
        this.list2 = result.data
      }
    },
    // 二级分类的事件回调
    async handler2() {
      // 清除数据
      this.list3 = []
      this.cForm.category3Id = ''
      const { category2Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      const result = await this.$API.attr.reqCategory3List(category2Id)
      if (result.code == 200) {
        this.list3 = result.data
      }
    },
    // 三级分类回调
    handler3() {
      // 获取三级分类的ID
      const { category3Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }

}
</script>

<style scoped>

</style>
