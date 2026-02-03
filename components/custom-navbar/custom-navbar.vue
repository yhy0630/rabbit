<template>
	<view class="custom-navbar" :style="{ height: navbarHeight + 'px' }">
		<view class="navbar-bg" :style="{ paddingTop: statusBarHeight + 'px', background: bgColor }">
			<view class="navbar-content" :class="{ 'is-left-title': titleAlign === 'left' }">
				<!-- 左侧返回按钮 -->
				<view class="navbar-left" @tap="handleBack" v-if="showBack">
					<u-icon name="arrow-left" color="#FFFFFF" size="44"></u-icon>
				</view>

				<!-- 标题（默认居中，可选靠左 + 下拉箭头） -->
				<view v-if="titleAlign === 'left'" class="navbar-title-left" @tap="handleTitleTap">
					<text class="navbar-title">{{ title }}</text>
					<text v-if="showDropdown" class="navbar-title-arrow">{{ dropdownIcon }}</text>
				</view>
				<view v-else class="navbar-center">
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
		},
		// 标题位置：center / left
		titleAlign: {
			type: String,
			default: 'center'
		},
		// 是否显示下拉箭头
		showDropdown: {
			type: Boolean,
			default: false
		},
		// 下拉箭头图标字符
		dropdownIcon: {
			type: String,
			default: '▼'
		},
		// 背景色（可覆盖默认渐变）
		bgColor: {
			type: String,
			default: 'linear-gradient(180deg, #149906 0%, #B3EE76 100%)'
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
		,
		handleTitleTap() {
			this.$emit('titleTap')
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

				&.is-left-title {
					/* 标题靠左时，让整体内容更贴近左侧，接近截图效果 */
					padding-left: 12rpx;
					padding-right: 20rpx;
				}
			
			.navbar-left {
				width: 80rpx;
				height: 44px;
				display: flex;
				align-items: center;
				justify-content: flex-start;
			}

				&.is-left-title {
					.navbar-left {
						/* 缩小左侧占位，让标题再向左靠一点 */
						width: 64rpx;
					}
				}

			.navbar-title-left {
				flex: 1;
				height: 44px;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				overflow: hidden;

				.navbar-title {
					font-size: 36rpx;
					font-weight: 600;
					color: #FFFFFF;
					max-width: 360rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.navbar-title-arrow {
					margin-left: 12rpx;
					font-size: 26rpx;
					color: rgba(255, 255, 255, 0.9);
					line-height: 1;
				}
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
