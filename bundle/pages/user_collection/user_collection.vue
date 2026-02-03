<template>
	<view class="user-collection">
		<custom-navbar title="我的收藏"></custom-navbar>
		<tabs
			:is-scroll="false"
			:current="active"
			bg-color="#B3EE76"
			sticky-bg-color="#B3EE76"
			active-color="#FFF"
			inactive-color="#FFF"
			:bar-style="{
				backgroundImage: 'linear-gradient(90deg, #1D9D0A 0%, #ACFF00 85.84%)'
			}"
			@change="onChange"
		>
			<tab name="商品">
				<collection-list :type="1" :i="0" :index="active"></collection-list>
			</tab>
			<tab name="店铺">
				<collection-list :type="2" :i="1" :index="active"></collection-list>
			</tab>
		</tabs>
	</view>
</template>

<script>
	// +----------------------------------------------------------------------
// | likeshop开源商城系统
// +----------------------------------------------------------------------
// | 欢迎阅读学习系统程序代码，建议反馈是我们前进的动力
// | gitee下载：https://gitee.com/likeshop_gitee
// | github下载：https://github.com/likeshop-github
// | 访问官网：https://www.likeshop.cn
// | 访问社区：https://home.likeshop.cn
// | 访问手册：http://doc.likeshop.cn
// | 微信公众号：likeshop技术社区
// | likeshop系列产品在gitee、github等公开渠道开源版本可免费商用，未经许可不能去除前后端官方版权标识
// |  likeshop系列产品收费版本务必购买商业授权，购买去版权授权后，方可去除前后端官方版权标识
// | 禁止对系统程序代码以任何目的，任何形式的再发布
// | likeshop团队版权所有并拥有最终解释权
// +----------------------------------------------------------------------
// | author: likeshop.cn.team
// +----------------------------------------------------------------------

	import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
	export default {
		components: {
			CustomNavbar
		},
		data() {
			return {
				active: 0
			};
		},



		methods: {
			onChange(index) {
				this.active = index
			}
		}
	};
</script>
<style lang="scss">
.user-collection {
	padding-top: 88px; // 为固定定位的导航栏留出空间（状态栏高度 + 导航栏高度）
}
</style>
