<template>
  <div>
    <el-card style="margin:20px 0px">
      <!--全局组件 -->
      <CategorySelect :show="scene!=0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <!-- 底部三部分 -->
      <div v-show="scene==0">
        <!-- 展示spu列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          />
          <el-table-column
            prop="spuName"
            label="spu名称"
            width="width"
          />
          <el-table-column
            prop="description"
            label="spu描述"
            width="width"
          />
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >
            <template slot-scope="{row,$index}">
              <!-- 按钮 -->
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)" />
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)" />
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前的spu的sku状态" @click="handler(row)" />
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除当前的spu" />
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <!--
          -->
        <el-pagination
          style="text-align:center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes, total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        />
      </div>
      <SpuFrom v-show="scene==1" ref="spu" @changeScene="changeScene">添加</SpuFrom>
      <SkuFrom v-show="scene==2" ref="sku" @changeScenes="changeScenes">sku</SkuFrom>
    </el-card>

    <el-dialog :title="`${spu.spuName}的sku的列表`" :visible.sync="dialogTableVisible">
      <el-table v-loading="loading" :data="skuList" style="width:100%" border>
        <el-table-column label="名称" width="width" prop="skuName" />
        <el-table-column label="价格" width="width" prop="price" />
        <el-table-column label="重量" prop="weight" width="width" />
        <el-table-column label="默认图片" width="width">
          <template slot-scope="row,$index">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// 引入子组件
import SkuFrom from './SkuFrom/SkuFrom.vue'
import SpuFrom from './SpuFrom/SpuFrom.vue'
export default {
  name: 'Spu',
  components: {
    SpuFrom,
    SkuFrom
  },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 控制三级联动的可操作性

      page: 1, // 分页器
      limit: 3, // 每一页显示的数据
      records: [], // 存储SPU列表的数据
      total: 0, // 分页器一共要展示的条数
      scene: 0, // 0代表展示spu列表数据 1添加spu或者修改spu 2添加sku
      // 控制对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      // 存储sku列表的数据
      skuList: [],
      loading: true
    }
  },

  methods: {
    // 三级联动的自定义事件，可以将子组件相应的Id，传递给父组件
    getCategoryId({ categoryId, level }) {
      // categoryId，获取一，二，三分类的Id，level可以区分几级Id
      if (level == 1) {
        this.category1Id = categoryId
        // 清除二级三级ID
        this.category2Id = ''
        this.category3Id = ''
      } else if (level == 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 获取Spu 的列表
        this.getSpuList()
      }
    },
    // 获取Spu列表数据的方法
    async  getSpuList(pages = 1) {
      this.page = pages
      const { page, limit, category3Id } = this
      // 需要携带参数page, limit, category3Id
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)

      if (result.code == 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 点击分页器的第几页按钮回调
    // handleCurrentChange(page) {
    //   this.page = page
    //   this.getSpuList()
    // }
    // 分页器发生变化时的回调函数
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit
      // 发请求
      this.getSpuList()
    },

    // 添加spu按钮的回调
    addSpu() {
      this.scene = 1
      // 通知子组件发请求
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改某一个spu
    updateSpu(row) {
      this.scene = 1
      // 获取子组件spufrom子组件的
      this.$refs.spu.initSpuData(row)
    },
    // 自定义事件的回调
    changeScene({ scene, flag }) {
      // flag这个形参为了区分保存按钮是添加还是修改
      // 切换场景
      this.scene = scene
      // 子组件通知父组件切换场景，后要更新数据
      if (flag == '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 删除spu的回调
    async  deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id)

      if (result.code == 200) {
        this.$message({ type: 'success', message: '删除成功' })
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加sku按钮的回调
    addSku(row) {
      console.log(row)
      // 切换场景为2
      this.scene = 2
      // 让父组件调用子组件的方法，让组件发请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // skuinfrom通知父组件修改场景
    changeScenes(scene) {
      this.scene = scene
    },
    // 查看sku按钮的回调
    async  handler(spu) {
      // 点击按钮显示对话框
      this.dialogTableVisible = true
      this.spu = spu
      this.loading = true
      // 获取sku列表数据进行展示
      const result = await this.$API.spu.reqSKuList(spu.id)
      if (result.code == 200) {
        this.skuList = result.data
        this.loading = false
      }
    }
  }

}
</script>

<style scoped>

</style>
