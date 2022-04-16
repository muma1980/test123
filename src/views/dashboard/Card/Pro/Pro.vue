<template>
  <!-- 容器 -->
  <div ref="charts" class="charts" />
</template>
<script>
// 引入echarts
import echarts from 'echarts'

export default {
  name: '',
  mounted() {
    // 初始化echarts实例
    const lineCharts = echarts.init(this.$refs.charts)
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏X轴
        show: false,
        // 最小值与最大值设置
        min: 0,
        max: 100

      },
      yAxis: {
        // 隐藏Y轴
        show: false,
        // 均分
        type: 'category'
      },
      // 系列
      series: [
        {
          type: 'bar',
          data: [78],
          color: 'pink',
          barWidth: 10,
          color: 'yellowgreen',
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          label: {
            show: true,
            formatter: '|',
            position: 'right'

          }

        }
      ],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }

    })
  }

}
</script>

<style scoped>
.charts{
  width:100%;
  height: 100%;
}
</style>
