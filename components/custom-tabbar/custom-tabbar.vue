<template>
	<view class="custom-tabbar">
		<!-- 背景图 -->
		<image class="tabbar-bg" src="/static/picture/bottom_bar.png" mode="widthFix"></image>
		
		<!-- 导航项容器 -->
		<view class="tabbar-content">
			<!-- 首页 -->
			<view class="tabbar-item item-1" @click="switchTab(0)">
				<image class="item-icon" :src="currentIndex === 0 ? iconList[0].selected : iconList[0].normal" mode="aspectFit"></image>
				<text class="item-text" :class="{ active: currentIndex === 0 }">首页</text>
			</view>
			
			<!-- 商城 -->
			<view class="tabbar-item item-2" @click="switchTab(1)">
				<image class="item-icon" :src="currentIndex === 1 ? iconList[1].selected : iconList[1].normal" mode="aspectFit"></image>
				<text class="item-text" :class="{ active: currentIndex === 1 }">商城</text>
			</view>
			
			<!-- 发布 (中间最高) -->
			<view class="tabbar-item item-3" @click="switchTab(2)">
				<image class="item-icon" :src="currentIndex === 2 ? iconList[2].selected : iconList[2].normal" mode="aspectFit"></image>
				<text class="item-text" :class="{ active: currentIndex === 2 }">发布</text>
			</view>
			
			<!-- 订单 -->
			<view class="tabbar-item item-4" @click="switchTab(3)">
				<image class="item-icon" :src="currentIndex === 3 ? iconList[3].selected : iconList[3].normal" mode="aspectFit"></image>
				<text class="item-text" :class="{ active: currentIndex === 3 }">订单</text>
			</view>
			
			<!-- 我的 -->
			<view class="tabbar-item item-5" @click="switchTab(4)">
				<image class="item-icon" :src="currentIndex === 4 ? iconList[4].selected : iconList[4].normal" mode="aspectFit"></image>
				<text class="item-text" :class="{ active: currentIndex === 4 }">我的</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'CustomTabbar',
	props: {
		// 当前选中的索引
		current: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			currentIndex: 0,
			// 图标配置
			iconList: [
				{
					normal: '/static/picture/HOME 1.png',
					selected: '/static/picture/HOME 1.png',
					path: '/pages/index/index'
				},
				{
					normal: '/static/picture/shopping_car.png',
					selected: '/static/picture/shopping_car.png',
					path: '/pages/goods_cate/goods_cate'
				},
				{
					normal: '/static/picture/publish.png',
					selected: '/static/picture/publish.png',
					path: '/bundle_b/pages/published_works/published_works'
				},
				{
					normal: '/static/picture/message.png',
					selected: '/static/picture/message.png',
					path: '/bundle/pages/user_order/user_order'
				},
				{
					normal: '/static/picture/user.png',
					selected: '/static/picture/user.png',
					path: '/pages/user/user'
				}
			]
		}
	},
	watch: {
		current: {
			immediate: true,
			handler(val) {
				this.currentIndex = val
			}
		}
	},
	methods: {
		switchTab(index) {
			this.currentIndex = index
			this.$emit('change', index)
			
			// 页面跳转
			const path = this.iconList[index].path
			
			// 检查当前页面路径
			const pages = getCurrentPages()
			const currentPage = pages[pages.length - 1]
			const currentRoute = '/' + currentPage.route
			
			// 如果已经在目标页面，不进行跳转
			if (currentRoute === path) {
				return
			}
			
			// 使用 uni.reLaunch 进行跳转
			uni.reLaunch({
				url: path,
				fail: () => {
					uni.redirectTo({
						url: path,
						fail: () => {
							uni.navigateTo({ 
								url: path
							})
						}
					})
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.custom-tabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100vw;
	margin: 0;
	padding: 0;
	z-index: 9999;
	box-sizing: border-box;
	
	.tabbar-bg {
		width: 100%;
		height: auto;
		display: block;
		padding: 0;
		margin: 0;
		line-height: 0;
		font-size: 0;
		position: relative;
		left: 1rpx;
	}
	
	.tabbar-content {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 40rpx;
		padding-left: 10%;
		padding-right: 10%;
		box-sizing: border-box;
		gap: 30rpx;
		
		.tabbar-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
			flex: 1;
			transition: all 0.3s ease;
			
			.item-icon {
				width: 90rpx;
				height: 90rpx;
				margin-bottom: 4rpx;
			}
			
			.item-text {
				font-size: 20rpx;
				color: #FFF;
				transition: color 0.3s ease;
			}
			
			.item-text.active {
				color: #26FF00;
			}
		}
		
		// 弧形布局 - 第一个和第五个最低
		.item-1,
		.item-5 {
			padding-bottom: 0rpx;
		}
		
		// 第二个和第四个稍高
		.item-2,
		.item-4 {
			padding-bottom: 10rpx;
		}
		
		// 第三个最高（中间发布按钮）
		.item-3 {
			padding-bottom: 20rpx;
			
			.item-icon {
				width: 90rpx;
				height: 90rpx;
			}
		}
	}
}

// 确保页面没有底部间距
page {
	padding-bottom: 0 !important;
	margin-bottom: 0 !important;
}
</style>
