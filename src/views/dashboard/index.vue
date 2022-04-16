<template>
  <div>
    <Card />
    <Sale />
    <Observe />
  </div>
</template>

<script>
import Card from '@/views/dashboard/Card/Card'
import Sale from '@/views/dashboard/Sale/Sale'
import Observe from '@/views/dashboard/Card/barCharts/Observe/Observe'
export default {
  name: '',
  components: {
    Card,
    Sale,
    Observe
  }

}
</script>

<style>

</style>

