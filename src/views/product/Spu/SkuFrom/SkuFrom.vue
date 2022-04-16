<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="spu的名称"> {{ spu.spuName }}} </el-form-item>
      <el-form-item label="Sku的名称">
        <el-input v-model="skuInfo.skuName" placeholder="请输入sku的名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(KG)" />
      </el-form-item>
      <el-form-item label="重量(KG)">
        <el-input v-model="skuInfo.weight" placeholder="重量(KG)" />
      </el-form-item>
      <el-form-item label="规格的描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4" placeholder="规格的描述" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="(attr,index) in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">>
          <el-table-column
            type="selection"
            prop="prop"
            label="label"
            width="50"
          />
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button v-if="row.isDefault==0" type="primary" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuFrom',
  data() {
    return {
      // 存储图片的信息
      spuImageList: [],
      // 销售属性
      spuSaleAttrList: [],
      // 存储平台属性
      attrInfoList: [],
      // 收集Sku数据的字段
      skuInfo: {
        // 第一类收集的数据，从父组件可以获取到的
        category3Id: 0,
        price: 0,
        weight: '',
        spuId: 0,
        skuDesc: '',
        // 第二类需要数据双向绑定
        tmId: 0,
        // 平台属性
        skuAttrValueList: [
          {
            attrId: 0,
            valueId: 0

          }
        ],
        // 默认图片
        skuDefaultImg: '',
        // 第三类，需要自己书写代码
        // 收集图片字段
        skuImageList: [
          // {

          //   imgName: '',
          //   imgUrl: '',
          //   isDefault: '',

          //   spuImgId: 0
          // }
        ],
        skuName: '',
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: '',
          //   saleAttrValueId: 0,
          //   saleAttrValueName: '',
          //   skuId: 0,
          //   spuId: 0
          // }
        ]

      },
      spu: {},
      // 收集图片的字段
      imageList: []
    }
  },
  methods: {
    // 获取skufrom 数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件给予的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 获取图片的数据
      const result = await this.$API.sku.reqSpuImageList(spu.id)
      if (result.code == 200) {
        const list = result.data
        list.forEach(element => {
          element.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取销售属性
      const result1 = await this.$API.sku.reqSpuSaleAttrList(spu.id)

      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data
      }
      // 获取平台属性
      const result2 = await this.$API.sku.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      )
      if (result2.code == 200) {
        this.attrInfoList = result2.data
      }
    },
    // table表格复选框按钮事件
    handleSelectionChange(params) {
      // 获取用户选中图片的信息数据。缺少isDefault字段
      this.imageList = params
    },
    // 排他操作
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0
      })
      // 点击的图片值为1
      row.isDefault = 1
      // 收集默认图片的数据
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    cancel() {
      // 触发自定义事件，让父组件切换场景为0
      this.$emit('changeScenes', 0)
      Object.assign(this._data, this.$options.data())
    },
    // 保存按钮的事件
    async  save() {
      // 整理参数
      // 整理平台属性
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])

      // 整理销售属性

      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      // 整理图片
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id

        }
      })
      // 发请求
      const result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '保存成功' })
        this.$emit('changeScenes', 0)
      }
    }

  }
}
</script>

<style></style>
