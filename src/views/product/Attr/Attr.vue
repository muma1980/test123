<template>
  <div>
    <el-card style="margin:20px 0px"> <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" /> </el-card>

    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格展示平台属性 -->
        <el-table border style="width: 100%" :data="attrList">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80"
          />
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
          />
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                type="success"
                style="margin: 0px 20px"
              >{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="150"
          >
            <template slot-scope="{row,$index}">

              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" />

            </template>
          </el-table-column>

        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width: 100%;margin:20px 0px" border :data="attrInfo.attrValueList">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="80"
          />
          <el-table-column width="width" prop="prop" label="属性值名称">
            <template slot-scope="{ row, $index }">
              <!-- 这里结构需要用到span与input进行来回的切换 -->
              <el-input
                v-if="row.flag"
                :ref="$index"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              />
              <span
                v-else
                style="display: block"
                @click="toEdit(row, $index)"
              >{{ row.valueName }}</span>
            </template>
          </el-table-column>

          <el-table-column width="width" prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length<1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 接受平台属性的字段
      attrList: [],
      // 这个属性控制table表格显示与隐藏
      isShowTable: true,
      // 收集新增属性|修改属性使用过
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [// 属性值，每一个属性值都是一个对象
          // {
          //   attrId: 0, // 相应属性名的Id

          //   valueName: ''
          // }
        ],
        categoryId: 0, // 三级分类的Id
        categoryLevel: 3 // 让服务器区分几级Id

      }
    }
  },
  methods: {
    // 自定义的回调
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level == 2) {
        this.category3Id = ''
        this.category2Id = categoryId
      } else {
        // 代表三级ID有了
        this.category3Id = categoryId
        // 可以发请求获取品牌属性
        this.getAttrList()
      }
    },
    // 获取平台属性的数组
    async getAttrList() {
    // 确定有三级分类的数据可以向服务器获取平台的属性进行展示
    // 获取分类的Id
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)

      if (result.code == 200) {
        this.attrList = result.data
      }
    },
    // 添加属性值的回调
    addAttrValue() {
      // 向属性值的数组里面添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 修改某一个属性，可以在以后的属性值基础之上新增属性值
        valueName: '',
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加属性按钮的回调
    addAttr() {
      // 切换table显示与隐藏
      this.isShowTable = false
      // 清除数据
      this.attrInfo = {
        attrName: '', // 属性名
        attrValueList: [// 属性值，每一个属性值都是一个对象

        ],
        categoryId: this.category3Id, // 三级分类的Id
        categoryLevel: 3 // 让服务器区分几级Id

      }
    },
    // 修改某一个属性
    updateAttr(row) {
      // isShowTable变为false
      this.isShowTable = false
      // 将选中的属性赋值给Attrinfo
      // 由于数据结构当中存在对象里面嵌套数组，数组里面又套对象，因此要使用深拷贝解决这类问题
      this.attrInfo = cloneDeep(row)
      // 在修改某一个属性的时候，将相应的属性值元素添加上flag这个标记
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'flag', false)
        item.flag = false
      })
    },
    // 失去焦点事件。
    toLook(row) {
      // 让当前编辑模式变为查看模式
      // 属性值为空不能作为新的属性值
      if (row.valueName.trim() == '') {
        this.$message('请输入正确属性值')
        return
      }

      const isRepat = this.attrInfo.attrValueList.some(item => {
        // 需要将row从数组里面判断的时候去除
        // row最新新增的属性值【数组的最后一项元素】
        // 判断的时候，需要把已有的数组当中新增的这个属性值去除
        if (row !== item) {
          return row.valueName == item.valueName
        }
      })
      console.log(isRepat)
      if (isRepat) return

      row.flag = false
      // row形参相当于用户添加的最新属性值
    },
    // 点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true
      // 获取input节点，实现自动聚焦
      // 需要注意，点击span的时候，切换为input变为编辑模式，但是需要注意，对于浏览器而言，页面的重绘和重拍耗时间
      this.$nextTick(() => {
        // 获取修改当前input的实现聚焦
        this.$refs[index].focus()
      })
    },
    // 气泡确认框按钮的回调
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮。进行添加属性或者修改属性的操作
    async addOrUpdateAttr() {
      // 整理参数
      // 如果用户添加为空，则不提交给服务器
      // 提交给服务器数据当中不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // 过滤掉属性值不是空的
        if (item.valueName != '') {
          // 代表有属性
          // 删除flag属性
          delete item.flag
          return true
        }
      })

      try {
      // 整理好数据，发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.$message({ type: 'success', message: '保存成功' })
        // 修改成功后获取最新的列表属性
        this.getAttrList()
        // 跳转页面进行展示
        this.isShowTable = true
      } catch (error) {
        this.$message('保存失败')
      }
    }
  }

}
</script>

<style scoped>

</style>
