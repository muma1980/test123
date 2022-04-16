// 引入封装好的axios接口
import request from '@/utils/request.js'

// 获取品牌列表的接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTraderMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

export const reqAddOrUpdateTradeMark = (tradeMark) => {
  // 带给服务器数据携带ID---修改
  if (tradeMark.id) {
    return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
  } else {
    // 新增品牌
    return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
  }
}
// 删除品牌 /admin/product/baseTrademark/remove/{id}

export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
