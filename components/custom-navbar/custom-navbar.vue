<template>
	<view class="custom-navbar" :style="{ height: navbarHeight + 'px' }">
		<view class="navbar-bg" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="navbar-content">
				<!-- 左侧返回按钮 -->
				<view class="navbar-left" @tap="handleBack" v-if="showBack">
					<u-icon name="arrow-left" color="#FFFFFF" size="44"></u-icon>
				</view>
				
				<!-- 中间标题 -->
				<view class="navbar-center">
					<text class="navbar-title">{{ title }}</text>
				</view>
				
				<!-- 右侧插槽 -->
				<view class="navbar-right">
					<slot name="right"></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'CustomNavbar',
	props: {
		// 导航栏标题
		title: {
			type: String,
			default: ''
		},
		// 是否显示返回按钮
		showBack: {
			type: Boolean,
			default: true
		},
		// 自定义返回事件
		customBack: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			statusBarHeight: 0,
			navbarHeight: 0
		};
	},
	mounted() {
		this.getSystemInfo();
	},
	methods: {
		getSystemInfo() {
			try {
				const systemInfo = uni.getSystemInfoSync();
				this.statusBarHeight = systemInfo.statusBarHeight || 0;
				// 导航栏高度 = 状态栏高度 + 导航栏内容高度(44px)
				this.navbarHeight = this.statusBarHeight + 44;
			} catch (e) {
				console.error('获取系统信息失败:', e);
				this.statusBarHeight = 20;
				this.navbarHeight = 64;
			}
		},
		handleBack() {
			if (this.customBack) {
				// 触发自定义返回事件
				this.$emit('back');
			} else {
				// 默认返回上一页
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.custom-navbar {
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999;
	
	.navbar-bg {
		width: 100%;
		background: linear-gradient(180deg, #149906 0%, #B3EE76 100%);
		
		.navbar-content {
			height: 44px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 20rpx;
			position: relative;
			
			.navbar-left {
				width: 80rpx;
				height: 44px;
				display: flex;
				align-items: center;
				justify-content: flex-start;
			}
			
			.navbar-center {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				
				.navbar-title {
					font-size: 36rpx;
					font-weight: 500;
					color: #FFFFFF;
				}
			}
			
			.navbar-right {
				width: 80rpx;
				height: 44px;
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}
		}
	}
}
</style>
