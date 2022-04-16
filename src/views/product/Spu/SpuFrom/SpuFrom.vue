<template>
  <div>

    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="spu的名称">
        <el-input v-model="spu.spuName" placeholder="spu的名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="(tm,index) in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="spu的描述">
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="spu的描述" />
      </el-form-item>
      <el-form-item label="spu的图片">
        <!--上传图片  action上传图片的地址
        list-type：文件列表的类型
        :on-preview：图片预览触发
        :on-remove：删除图片触发
        file-list
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-success="handlerSuccess"
          :on-remove="handleRemove"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}个未选择`">
          <el-option v-for="(unselect, index) in unSelectSaleAttr" :key="unselect.id" :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" />
        </el-select>
        <el-button type="primary" icon="el-icon-puls" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          />
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="100px"
          />
          <el-table-column
            prop="prop"
            label="属性值名称列表"
            width="width"
          >
            <!--  @close="handleClose(tag)" -->
            <template slot-scope="{row,$index}">
              <el-tag
                v-for="(tag,index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 实现span和input切换
               @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @blur="handleInputConfirm(row)"
              />
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>

            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="150px"
          ><template slot-scope="{row,$index}">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)" />
          </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  name: 'SpuFrom',
  data() {
    return {
      // 收集未选择的销售属性的Id
      attrIdAndAttrName: '',
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储请求回来的数据,初始是空对象，修改的时候回，会给服务器发请求，
      spu: {
        // 三级分类的ID
        category3Id: 0,
        // 描述
        description: '',
        // 品牌Id
        tmId: '',
        // spu的名称
        spuName: '',
        // 收集spu图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   spuId: 0
          // }
        ],
        // 平台属性与属性值的收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: 'string',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: 'string',
          //       saleAttrName: 'string',
          //       saleAttrValueName: 'string',
          //       spuId: 0
          //     }
          //   ]
          // }
        ]
      },
      // 储存从服务器获取的品牌信息
      tradeMarkList: [],
      // 储存从服务器获取的图片信息
      spuImageList: [],
      // 储存从服务器获取的销售属性
      saleAttrList: []
    }
  },
  computed: {
    // 计算出还没有选择的销售属性
    unSelectSaleAttr() {
      // 平台销售属性为3个 saleAttrList:
      // 当前销售属性spu.spuSaleAttrList
      // 将已有的数组当中过滤出用户需要的元素，并且未返回新的数据
      const result = this.saleAttrList.filter((item) => {
        // every数组的方法，会返回一个布尔值（真或者假—）
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName
        })
      })
      return result
    }
  },
  methods: {
    handleRemove(file, fileList) {
      // 收集照片墙的图片的数据
      this.spuImageList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 初始化spufrom
    // 在父组件中可以通过$ref获取子组件
    async initSpuData(spu) {
      // 获取spu信息的数据
      const spuResult = await this.$API.spu.reqSpu(spu.id)

      if (spuResult.code == 200) {
        // 修改spu的时候，需要向服务器发请求，并且将返回的数据赋值给spu
        this.spu = spuResult.data
      }
      // 获取品牌的信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()

      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取spu图片数据
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (spuImageResult.code == 200) {
        const listArr = spuImageResult.data
        // 由于照片墙显示数据需要数组，需要name和url字段
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 整理好的数据赋值给
        this.spuImageList = listArr
      }
      // 获取平台所有的销售属性
      const saleRequest = await this.$API.spu.reqBaseSaleAttrList()

      if (saleRequest.code == 200) {
        this.saleAttrList = saleRequest.data
      }
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      // 收集图片信息
      this.spuImageList = fileList
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 已经收集需要的销售属性的信息
      // 把收集到的销售属性数据进行分割

      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      // 向spu对象的spuSaleAttrList属性里面添加新的销售属性
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      // 添加新的属性
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 清空数据
      this.attrIdAndAttrName = ''
    },
    // 添加按钮的回调
    addSaleAttrValue(row) {
      // 点击销售属性值当中添加按钮的时候，需要让button变为input，通过当前的销售属性的inputVisible控制
      // 挂载在销售属性身上的响应式数据inoutVisible,控制input和span的切换
      this.$set(row, 'inputVisible', true)
      // 通过响应式数据InputValue字段收集新增的销售属性值
      this.$set(row, 'inputValue', '')
    },
    // el-input使用焦点事件
    handleInputConfirm(row) {
      // 解构出销售属性当中的收集数据
      const { baseSaleAttrId, inputValue } = row

      if (inputValue.trim() !== '') {
        // 属性值不能重复
        const result = row.spuSaleAttrValueList.every((item) => item.saleAttrValueName != inputValue)
        if (!result) return alert('属性值不能相同')

        const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
        // 新增
        row.spuSaleAttrValueList.push(newSaleAttrValue)
        // 修改inputVisible字段为false

        row.inputVisible = false
      } else {
        this.$message('属性值不能为空')
        return
      }
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 整理参数：需要整理照片墙的数据
      // 携带参数：对于图片，需要携带imageName与imageUrl字段
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url
        }
      })
      // 发请求
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code == 200) {
        // 提示
        this.$message({ type: 'success', message: '保存成功' })
        // 通知父组件回到场景0
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      // 清理数据
      // Object.assign新增方法可以合并对象
      // this._data组件实例，可以操作data当中的响应式数据
      // this.$options.data可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加SPU按钮的时候，发请求的函数
    async  addSpuData(category3Id) {
      // 添加spu的时候收集三级分类的ID
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()

      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取平台所有的销售属性
      const saleRequest = await this.$API.spu.reqBaseSaleAttrList()

      if (saleRequest.code == 200) {
        this.saleAttrList = saleRequest.data
      }
    },
    // 取消按钮
    cancel() {
      // 取消按钮的回调，通知父亲回到首页
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 清理数据
      // Object.assign新增方法可以合并对象
      // this._data组件实例，可以操作data当中的响应式数据
      // this.$options.data可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空
      Object.assign(this._data, this.$options.data())
    }

  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
