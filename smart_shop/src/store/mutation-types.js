/**
 * Created by Janus on 2017/4/1.
 * 状态控制
 */

export const ADD_TO_CART = 'ADD_TO_CART'  // 添加到购物车
export const REDUCE_FROM_CART = 'REDUCE_FROM_CART' // 从购物中移除
export const CHECK_CARD = 'CHECK_CARD' // 检查购物车内商品状态, 移除无效商品
export const CLEAR_CART = 'CLEAR_CART' // 清空购物车

export const SET_SHOP_SERIAL = 'SET_SHOP_SERIAL'     // 设置商店id
export const SET_BRANCH_ID = 'SET_BRANCH_ID'         // 设置门店id
export const SET_WXOPEN_ID = 'SET_WXOPEN_ID'         // 设置openid
export const SET_SHOP_DATA = 'SET_SHOP_DATA'         // 设置菜单信息

export const SET_TABLE_ID = 'SET_TABLE_ID'         // 座位号
export const SET_TABLE_NAME = 'SET_TABLE_NAME'         // 座位名
export const SET_ORDER_ID = 'SET_ORDER_ID'         // 提交的订单ID
export const SET_SHOP_INFO = 'SET_SHOP_INFO'       // 商户基本信息（大小图信息之类）
export const SET_PHONE = 'SET_PHONE'       // 设置用户手机号

export const SET_LOCATION = 'SET_LOCATION'          // 设置经纬度
export const SET_CITY_ID = 'SET_CITY_ID'              // 城市id
export const SET_FATHER_CITY_ID = 'SET_FATHER_CITY_ID'              // 城市id
export const SET_CITY_NAME = 'SET_CITY_NAME'              // 城市名称
export const SET_CITY_LIST = 'SET_CITY_LIST'         // 城市的列表id
export const SET_VAGUESHOPBRANCHNAME = 'SET_VAGUESHOPBRANCHNAME' // 保存模糊搜索门店名
export const SET_GOODS_SCROLL_TOP = 'SET_GOODS_SCROLL_TOP' // 记录购物车滑动的位置
export const SET_INPUT_NUMBER = 'SET_INPUT_NUMBER' // 人数
export const SET_INPUT_REMART = 'SET_INPUT_REMART' // 备注
export const SET_MEMBER_STATUS = 'SET_MEMBER_STATUS' // 会员状态(customerId与会员状态)
export const SET_MEMBER_RESULT_STATUS = 'SET_MEMBER_RESULT_STATUS' // 注册成功返回更新的会员状态
export const SET_NEXT_CAMPAIGN = 'SET_NEXT_CAMPAIGN' // 活动
export const SET_NOTICE_INFO = 'SET_NOTICE_INFO' // 公告信息

export const SET_LOGO_INFO = 'SET_LOGO_INFO' // 底部的logo信息
