<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
    >添加</el-button>
    <!-- 表格组件
  data:表格组件将来需要展示的数据，数组
  border:是给表格添加边框
  label:显示的标题、
  align:标题对齐的方式
  注意：elmentUI当中的table组件，是一列一列的展示数据
  prop对应列展示的字段名
  -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column align="center" label="序号" type="index" width="80" />
      label=""
      <el-table-column label="品牌名称" prop="tmName" width="width" />
      <el-table-column label="品牌LOGO" prop="logoUrl" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px">
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="prop" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="ek-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
          >修改</el-button>
          <el-button
            type="danger"
            icon="ek-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
    当前第几页，数据总条数，每一页展示的条数
  @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      page-sizes代表当前第几页
      total代表分页器，一共要展示的条数
      page-size代表每一页可以展示几条数据
      page-sizes代表可以设置每一页展示多少条数据
      layout可以实现分页器的布局，通过写的顺序决定
      pager-count代表显示的页码个数

    -->
    <el-pagination
      style="margin-top: 20px; textalign: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :pager-count="7"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    />
    <!-- 对话框
    ：visible.sync控制对话框显示隐藏用的
    Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
     -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 展示表单元素 model属性可以收集表单数据
      action:设置图片上传地址
      ：on-success可以检测到图片上传成功，档图片上传成功，会执行一次
      ：before-upload可以在上传图片之前，执行一次
       -->
      <el-form ref="ruleForm" style="width: 80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!--   收集图片数据，不能使用v-model-->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addOrUpdateTradeMark"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    // 自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('请输入2到10位的品牌名称'))
      } else {
        callback()
      }
    }
    return {
      // 代表分页器第几页
      page: 1,
      // 展示的数据的个数
      limit: 3,
      // 总数据
      total: 0,
      // 列表展示的数据
      list: [],
      // 控制对话框显示隐藏
      dialogFormVisible: false,

      // 收集品牌信息
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // 表单验证规则
      rules: {
        // 品牌名称验证规则
        tmName: [
          // required必须校验字段 message提示信息 trigger用户行为设置
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // {
          //   // min最少字符，max最多字符
          //   min: 2,
          //   max: 10,
          //   message: '长度在 2 到 10个字符',
          //   trigger: 'change'
          // }
          // 自定义校验规则
          { validator: validateTmName, trigger: 'change' }
        ],
        // 品牌LOGO验证规则
        logoUrl: [
          { required: true, message: '请添加品牌LOGO区域' }
        ]
      }
    }
  },
  mounted() {
    // 组件挂载完毕发送请求
    // console.log(this.$API)
    // 获取列表数据方法
    this.getPageList()
  },
  methods: {
    // 获取品牌列表数据
    async getPageList(pager = 1) {
      this.page = pager
      // 解构出需要的参数
      const { page, limit } = this

      // 获取品牌列表的接口
      // 发请求的时候需要携带两个参数，第几页，和显示的数据个数
      const result = await this.$API.trademark.reqTraderMarkList(page, limit)
      if (result.code == 200) {
        // 总条数和列表展示的数据
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    // 分页器某一页需要展示数据的条数发生变化的时候会触发
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    // 点击添加品牌按钮
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true
      // 清除数据
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    // 修改某一个品牌
    updateTradeMark(row) {
      // row表示当前选中品牌的信息
      this.dialogFormVisible = true
      // 将已有的品牌信息赋值给tmfrom
      // 将服务器返回的品牌数据，直接赋值个tmfrom进行展示
      this.tmForm = { ...row }
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res上传成功之后返回的前端数据
      // file上传成功之后服务器返回前端的数据
      // 收集品牌图片数据
      this.tmForm.logoUrl = res.data
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 添加按钮或者修改
    addOrUpdateTradeMark() {
      // 全部验证字段通过后，才能书写逻辑
      this.$refs.ruleForm.validate(async(success) => {
        // 如果字段符合条件
        if (success) {
          this.dialogFormVisible = false
          // 发请求（添加或者修改）
          const result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          )

          // 弹出信息
          if (result.code === 200) {
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
            })
            // 添加或者修改品牌成功以后，需要再次获取品牌列表进行展示
            // 修改则应该停留在修改的页面
            this.getPageList(this.tmForm.id ? this.page : 1)
          }
        } else {
          console.log('error.submit')
          return false
        }
      })
    },
    // 删除品牌的操作
    deleteTradeMark(row) {
      this.$confirm(`确定删除${row.tmName}的品牌信息吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 当用户点击确定按钮时触发
        // 向服务器发请求
        const result = await this.$API.trademark.reqDeleteTradeMark(row.id)

        if (result.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'

          })
          // 再次获取品牌列表数据
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
        }
      }).catch(() => {
        this.$message({
          // 当用户取消时触发
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
