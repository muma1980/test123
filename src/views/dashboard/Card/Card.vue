<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <!-- 第一个Card -->
          <Detail title="总销售额" count="￥ 126560">
            <template slot="charts">
              <span>周同比&nbsp;&nbsp;56.67% <svg t="1649917912162" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4684" width="16" height="16"><path d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z" fill="#d81e06" p-id="4685" /></svg></span>
              &nbsp;&nbsp;
              <span>日同比&nbsp;&nbsp;19.96% <svg t="1649918028881" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6536" width="16" height="16"><path d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z" fill="#1afa29" p-id="6537" /></svg></span>
            </template>
            <template slot="footer">
              <span>日销售额 ￥12425</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第2个Card -->
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <LineChart />
            </template>
            <template slot="footer">
              <span>日访问量1256</span>
            </template></Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第3个Card -->
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <BarCharts />
            </template>
            <template slot="footer">
              <span>转化率85%</span>
            </template></Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第4个Card -->
          <Detail title="运营活动效果" count="78%">
            <template slot="charts"> <Pro /></template>
            <template slot="footer">
              <span>周同比&nbsp;&nbsp;56.67% <svg t="1649917912162" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4684" width="16" height="16"><path d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z" fill="#d81e06" p-id="4685" /></svg></span>
              &nbsp;&nbsp;
              <span>日同比&nbsp;&nbsp;19.96% <svg t="1649918028881" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6536" width="16" height="16"><path d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z" fill="#1afa29" p-id="6537" /></svg></span>
            </template>
          </detail></el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from '@/views/dashboard/Card/Detail/Detail'
import LineChart from '@/views/dashboard/Card/lineChart/LineChart'
import BarCharts from '@/views/dashboard/Card/barCharts/BarCharts'
import Pro from '@/views/dashboard/Card/Pro/Pro'

export default {
  name: '',
  components: {
    Detail,
    LineChart,
    BarCharts,
    Pro

  }

}
</script>

<style>

</style>
