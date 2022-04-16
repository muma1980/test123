// 引入axios二次封装
import request from '@/utils/request'

// 获取SPU列表数据的接口 /admin/product/{page}/{limit}
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id }})

// /admin/product/getSpuById/{spuId} 获取spu信息 get
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })
// 获取品牌信息进行展示 /admin/product/baseTrademark/inner/findBaseTrademarkByTrademarkIdList

export const reqTradeMarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })

// 获取spu图片接口 GET /admin/product/getSpuById/{spuId}
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
// 获取销售属性 /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })

//  修改spu或者添加SPU
export const reqAddOrUpdateSpu = (spuInfo) => {
  // 携带参数有Id，修改spu
  if (spuInfo.id) {
    return request({ url: `/admin/product/updateSpuInfo`, method: 'post', data: spuInfo })
  } else {
    // 不带Id，添加spu
    return request({ url: `/admin/product/saveSpuInfo`, method: 'post', data: spuInfo })
  }
}
// 删除spu
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })
// 添加 /admin/product/saveSkuInfo
export const reqAddSku = (skuInfo) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })
// 获取sku列表数据的接口 GET /admin/product/findBySpuId/{spuId}
export const reqSKuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })
