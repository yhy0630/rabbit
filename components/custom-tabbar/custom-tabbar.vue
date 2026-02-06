<template>
	<view class="custom-tabbar">
		<!-- 背景图 -->
		<image class="tabbar-bg" src="/static/picture/bottom_bar.png" mode="widthFix"></image>
		
		<!-- 导航项容器 -->
		<view class="tabbar-content" :class="'tabs-' + displayTabs.length">
			<view
				class="tabbar-item"
				v-for="(tab, index) in displayTabs"
				:key="tab.id || index"
				:class="'item-' + (index + 1)"
				@click="switchTab(index)"
			>
				<image
					class="item-icon"
					:src="currentIndex === index ? tab.selected : tab.normal"
					mode="aspectFit"
				></image>
				<text
					class="item-text"
					:class="{ active: currentIndex === index }"
				>
					{{ tab.text }}
				</text>
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
		},
		// 要显示的导航按钮配置（由各页面传入）
		// 例如：
		// [
		//   { id: 'home', path: '/pages/index/index' },
		//   { id: 'mall', path: '/pages/goods_cate/goods_cate' },
		//   { id: 'publish', path: '/bundle_b/pages/published_works/published_works' }
		// ]
		tabs: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			currentIndex: 0,
			// 图标 & 文案配置（仅负责样式和展示，不包含路径）
			// 新增通用按钮时，只需要在这里追加一项，并约定一个唯一的 id
			iconList: [
				{
					id: 'home',
					text: '首页',
					normal: '/static/picture/HOME 1.png',
					selected: '/static/picture/HOME 1.png'
				},
				{
					id: 'mall',
					text: '商城',
					normal: '/static/picture/shopping_car.png',
					selected: '/static/picture/shopping_car.png'
				},
				{
					id: 'publish',
					text: '发布',
					normal: '/static/picture/publish.png',
					selected: '/static/picture/publish.png'
				},
				{
					id: 'order',
					text: '订单',
					normal: '/static/picture/message.png',
					selected: '/static/picture/message.png'
				},
				{
					id: 'user',
					text: '我的',
					normal: '/static/picture/user.png',
					selected: '/static/picture/user.png'
				},
				{
					id: 'message',
					text: '消息',
					normal: '/static/picture/message.png',
					selected: '/static/picture/message.png'
				}
			],
			// 默认路径（兼容未传 tabs 的情况，使用现在的 5 个按钮和跳转）
			defaultPaths: {
				home: '/pages/index/index',
				mall: '/pages/goods_cate/goods_cate',
				publish: '/bundle_b/pages/published_works/published_works',
				order: '/bundle/pages/user_order/user_order',
				user: '/pages/user/user'
			}
		}
	},
	computed: {
		// 实际要渲染的按钮列表（最多 5 个，最少由业务自己控制不低于 3 个）
		displayTabs() {
			// 如果页面没有传 tabs，就使用默认的 5 个按钮和默认路径
			if (!Array.isArray(this.tabs) || this.tabs.length === 0) {
				return this.iconList.map((icon) => {
					const path = this.defaultPaths[icon.id] || ''
					return {
						...icon,
						path
					}
				})
			}
			
			// 页面传入了 tabs：根据 id 关联到 iconList，并覆盖路径
			const result = this.tabs
				.map((tab) => {
					const icon = this.iconList.find((item) => item.id === tab.id)
					if (!icon) return null
					
					return {
						...icon,
						path: tab.path || this.defaultPaths[icon.id] || ''
					}
				})
				.filter((item) => !!item)
			return result.slice(0, 5)
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
			const tabs = this.displayTabs
			if (!tabs || !tabs[index]) {
				return
			}
			
			// 页面跳转
			const path = tabs[index].path
			if (!path) {
				return
			}
			
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

		// 当只有 3 个按钮时，首页与“我的”按钮齐平，中间按钮略高
		&.tabs-3 {
			.item-1,
			.item-3 {
				padding-bottom: 10rpx;
			}

			.item-2 {
				padding-bottom: 15rpx;
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
