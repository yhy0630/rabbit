<template>
	<view class="cate-one">
		<cate-list
			v-if="cateList.length"
			:key="selectIndex"
			:top="84"
			ref="mescrollItem"
			:i="selectIndex"
			:index="selectIndex"
			:cate="cateList[selectIndex]"
		>
			<!-- 在广告轮播下方插入分类网格 -->
			<template v-slot:header>
				<view class="cate-grid-container">
					<swiper 
						class="cate-swiper" 
						:indicator-dots="true" 
						:autoplay="false"
						indicator-color="rgba(0, 0, 0, .3)"
						indicator-active-color="#52c41a"
					>
						<!-- 每页显示10个分类（2行5列） -->
						<swiper-item v-for="(page, pageIndex) in Math.ceil(cateList.length / 10)" :key="pageIndex">
							<view class="cate-grid">
								<view 
									class="cate-item" 
									v-for="(cateItem, cateIndex) in cateList.slice(pageIndex * 10, (pageIndex + 1) * 10)" 
									:key="cateIndex"
									@click="changeActive(pageIndex * 10 + cateIndex)"
								>
									<!-- 圆形图片 -->
									<view class="cate-image-wrap" :class="{ active: selectIndex === (pageIndex * 10 + cateIndex) }">
										<image 
											class="cate-image" 
											:src="cateItem.bg_image || cateItem.image" 
											mode="aspectFill"
										></image>
									</view>
									<!-- 分类名称 -->
									<text class="cate-name">{{ cateItem.name }}</text>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>

				<!-- 一级分类横向滑动条，放在筛选栏上方 -->
				<view class="cate-scroll">
					<scroll-view scroll-x="true" class="scroll-wrap" show-scrollbar="false">
						<view class="scroll-list">
							<view
								class="scroll-item"
								v-for="(cateItem, cateIndex) in cateList"
								:key="cateIndex"
								:class="{ active: selectIndex === cateIndex }"
								@click="changeActive(cateIndex)"
							>
								<text class="cate-name">{{ cateItem.name }}</text>
							</view>
						</view>
					</scroll-view>
				</view>
			</template>
		</cate-list>
	</view>
</template>

<script>
	export default {
		name:"cate-one",
		props: {
			// 一级分类列表数据
			cateList: {
				type: Array,
				default: () => ([])
			},
		},
		data() {
			return {
				selectIndex: 0, // 当前选中的分类索引
				showCate: [] // 预留字段（当前实现中已不再使用）
			};
		},
		methods:{
			// 切换分类
			changeActive(index) {
				if (this.selectIndex === index) return
				this.selectIndex = index
				// 分类切换后刷新当前列表
				this.$nextTick(() => {
					this.$refs.mescrollItem && this.$refs.mescrollItem.onRefresh && this.$refs.mescrollItem.onRefresh()
				})
			},
		},
		watch: {
			// 分类列表变化时，重置选中项
			cateList(val) {
				if (!val || !val.length) return
				if (this.selectIndex >= val.length) {
					this.selectIndex = 0
				}
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.cate-one {
		height: 100%;
		background-color: #f5f5f5;
		
		/* 分类网格容器 - 随滚动而滚动 */
		.cate-grid-container {
			background-color: #fff;
			padding-bottom: 0rpx;
			
			.cate-swiper {
				height: 430rpx; /* 增加高度以容纳指示器 */
				
				/* 调整指示器位置 - 移到分类内容下方 */
				/deep/ .uni-swiper-dots {
					bottom: 20rpx;
				}
				
				.cate-grid {
					display: flex;
					flex-wrap: wrap;
					padding: 30rpx 20rpx 0;
					
					.cate-item {
						width: 20%; /* 每行5个 */
						display: flex;
						flex-direction: column;
						align-items: center;
						margin-bottom: 30rpx;
						
						/* 圆形图片容器 */
						.cate-image-wrap {
							width: 120rpx;
							height: 120rpx;
							border-radius: 50%;
							overflow: hidden;
							background-color: #f0f0f0;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-bottom: 10rpx;
							transition: all 0.3s;
							
							/* 选中状态 */
							&.active {
								box-shadow: 0 0 0 4rpx rgba(25, 137, 250, 0.3);
							}
							
							.cate-image {
								width: 100%;
								height: 100%;
							}
						}
						
						/* 分类名称 */
						.cate-name {
							font-size: 24rpx;
							color: #333;
							text-align: center;
							max-width: 120rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
			}
		}
		
		/* 横向滑动的一级分类条 */
		.cate-scroll {
			background: #fff;
			padding: 10rpx 0 0;
			margin-top: 20rpx;

			
			.scroll-wrap {
				white-space: nowrap;
				padding: 0 20rpx 10rpx;
			}
			
			.scroll-list {
				display: flex;
				align-items: center;
			}
			
			.scroll-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin-right: 30rpx;
				position: relative;
				
				&:last-child {
					margin-right: 0;
				}
				
				.cate-name {
					font-size: 24rpx;
					color: #333;
					padding: 10rpx 0;
				}
				
				&.active {
					.cate-name {
						color: #1B8902;
						font-weight: 600;
					}
					
					/* 渐变色下划线 */
					&::after {
						content: '';
						position: absolute;
						bottom: 0;
						left: 50%;
						transform: translateX(-50%);
						width: 60rpx;
						height: 4rpx;
						background: linear-gradient(90deg, #9DE703 0%, #1F8C03 100%);
						border-radius: 2rpx;
					}
				}
			}
		}
		
		/* tabs标签栏 */
		.box-tabs {
			background-color: #fff;
			border-bottom: 1px solid #f0f0f0;
			
			.tabs-scroll {
				white-space: nowrap;
				width: 100%;
				
				.tabs-list {
					display: inline-block;
					padding: 0 20rpx;
					
					.tab-item {
						display: inline-block;
						padding: 20rpx 30rpx;
						font-size: 28rpx;
						color: #666;
						position: relative;
						
						&.active {
							color: #1B8902;
							font-weight: bold;
							
							&::after {
								content: '';
								position: absolute;
								bottom: 0;
								left: 50%;
								transform: translateX(-50%);
								width: 60rpx;
								height: 4rpx;
								background: linear-gradient(90deg, #9DE703 0%, #1F8C03 100%);
								border-radius: 2rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
