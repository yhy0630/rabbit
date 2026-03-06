import request from '@/utils/request'
import {client} from '@/utils/tools'




//获取首页数据接口
export function getHome(params) {
	return request.get('index/index', { params })
}

// 通过首页分类id获取数据
export function getIndexCategory(params) {
	return request.get('index/indexCategory', {params})
}
//获取菜单
export function getMenu(data) {
	return request.get('menu/lists', {
		params: data,
	});
}

//商品栏目
export function getGoodsColumn() {
	return request.get('goods_column/getGoodsColumnList');
}

//栏目商品
export function getGoodsListColumn(params) {
	return request.get('goods/getGoodsListByColumnId', {params});
}

//平台一级分类
export function getLevelOneList() {
	return request.get('goods_category/getLevelOneList');
}

// 一级分类的后代分类
export function getListByLevelOne(params) {
	return request.get('goods_category/getListByLevelOne', {params});
}


//品牌列表
export function getBrandList() {
	return request.get('goods_brand/getGoodsBrandList');
}

//文章分类
export function getCategoryList(data) {
    let {type} = data
    let url = type ? 'help/category' : 'article/category'
    delete data.type
    return request.get(url)
}

//文章列表
export function getArticleList(data) {
    let {type} = data
    let url = type ? 'help/lists' : 'article/lists'
    delete data.type
    return request.get(url, {
        params: data
    })
}

// 文章详情
export function getArticleDetail(data) {
    let {type} = data
    let url = type ? 'help/detail' : 'article/detail'
    delete data.type
    return request.get(url, {
        params: { id: data.id }
    })
}

//购物车
export function getCartList() {
	return request.get('cart/lists')
}

//商品详情
export function getGoodsDetail(data) {
	return request.get('goods/getGoodsDetail', {
		params: data
	});
}


//加入购物车

export function addCart(data) {
  return request.post('cart/add', data);
} 

 //购物车数量

export function getCartNum(params) {
  return request.get("cart/num", {params});
}


// 购物车数量更改
export function changeGoodsCount(data) {
	return request.post("cart/change", data)
}

// 单选/全选/店铺选择
export function selectedOpt(data) {
	return request.post("cart/selected", data)
}

// 删除商品
export function deleteGoods(data) {
	return request.post("cart/del", data);
}

//购物车选中状态
export function changeCartSelect(data) {
	return request.post('cart/selected', data)
}

//广告位
export function getAdList(data) {
	return request.get('ad_content/lists', {
		params: data
	});
}


// 商品分类
export function getCatrgory() {
	return request.get('goods_category/lists');
}


// 商品搜索

export function getGoodsList(data) {
	return request.get('goods/getGoodsList', {
		params: data
	});
}

//评价列表
export function getCommentList(data) {
	return request.get("goods_comment/lists", {
		params: data
	})
}

//评价分类
export function getCommentCategory(id) {
	return request.get("goods_comment/category", {
		params: {
			goods_id: id
		}
	})
}

//搜索页,热门搜索列表,和历史搜索列表
export function getSearchpage() {
	return request.get('search_record/lists');
}

// 清空历史搜索
export function clearSearch() {
	return request.post('search_record/clear');
}




//商品海报

export function getPoster(data) {
	return request.get("share/sharegoods", {
		params: data
	});
}

// 消息中心首页
export function getMessageLists() {
	return request.get("notice/index")
}

// 消息通知
export function getNoticeLists(params) {
	return request.get("notice/lists", {params})
}

// 城市列表
export function getCityLists() {
	return request.get("index/city")
}

// 逆解析定位地址
export function getGeocoder(params) {
	return request.get("index/geocoder", {params})
}

// 获取家政服务分类列表（首页显示）
export function getHomeServiceCategoryList() {
	return request.get("home_service_category/getHomeShowList")
}

// 获取所有家政服务分类列表（全部服务页面）
export function getAllHomeServiceCategoryList() {
	return request.get("home_service_category/getAllList")
}

// 根据分类获取服务列表
export function getHomeServiceListByCategory(params) {
	return request.get("home_service/getListByCategory", {params})
}

// 获取服务详情
export function getHomeServiceDetail(params) {
	return request.get("home_service/getDetail", {params})
}

// 入驻商家（添加公司）
export function addHomeServiceCompany(data) {
	return request.post("home_service_company/add", data)
}

// 发布服务
export function addHomeService(data) {
	return request.post("home_service/add", data)
}

// 创建家政服务订单
export function createHomeServiceOrder(data) {
	return request.post("home_service_order/create", data)
}

// 获取家政服务订单列表
export function getHomeServiceOrderList(params) {
	return request.get("home_service_order/lists", {params})
}

// 获取家政服务订单详情
export function getHomeServiceOrderDetail(params) {
	return request.get("home_service_order/detail", {params})
}

// 创建快递订单
export function createExpressOrder(data) {
    return request.post("express_order/create", data)
}

// 师傅入驻申请
export function applyHomeServiceMaster(data) {
	return request.post("home_service_master/apply", data)
}

// 获取师傅申请详情
export function getHomeServiceMasterDetail() {
	return request.get("home_service_master/detail")
}

// 检查师傅状态
export function checkHomeServiceMasterStatus() {
	return request.get("home_service_master/checkStatus")
}

// ========== 房产模块 API ==========
// 房源分类列表（首页/筛选）
export function getPropertyCategoryList() {
	return request.get("property/getCategoryList")
}
// 房源列表（支持 category_id, keyword, province_id, city_id, district_id, price_min, price_max, room, page, limit）
export function getPropertyList(params) {
	return request.get("property/getList", { params })
}
// 房源详情
export function getPropertyDetail(params) {
	return request.get("property/getDetail", { params })
}
// 提交房源（发布二手房，待审核）
export function submitPropertyListing(data) {
	return request.post("property/submit", data)
}
// 我的发布列表（type, status, page, limit）
export function getMyPropertyList(params) {
	return request.get("property/getMyPublishList", { params })
}
// 上架/下架房源
export function togglePropertyStatus(data) {
	return request.post("property/toggleStatus", data)
}
// 我的发布统计
export function getMyPropertyStats() {
	return request.get("property/getMyPublishStats")
}
// 会员角色列表（申请入驻）
export function getPropertyMemberRoleList() {
	return request.get("property/getMemberRoleList")
}
// 提交身份申请
export function submitPropertyIdentityApply(data) {
	return request.post("property/identityApply", data)
}
// 预约看房提交
export function submitPropertyViewingBooking(data) {
	return request.post("property/bookViewing", data)
}
// 我收到的预约看房列表（经纪人/发布人）
export function getMyViewingBookings(params) {
	return request.get("property/getMyViewingBookings", { params })
}
// 当前用户已通过的房产身份（经纪人/经纪公司）
export function getMyPropertyIdentities() {
	return request.get("property/getMyPropertyIdentities")
}
// 我收到的预约看房列表（按房源分组，选项卡用）
export function getMyViewingBookingsGrouped() {
	return request.get("property/getMyViewingBookingsGrouped")
}