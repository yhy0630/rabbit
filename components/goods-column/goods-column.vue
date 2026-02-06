<template>
	<!-- 当mescroll-body写在子组件时,父页面需引入mescroll-comp.js的mixins -->
	<mescroll-body ref="mescrollRef" @init="mescrollInit"  @down="downCallback" @up="upCallback"
		:up="upOption" :down="downOption" v-if="hasData">
		<!-- 数据列表 -->
		<view class="goods-column">
			<scroll-view scroll-x="true">
				<view class="column-wrap">
					<view class="item flex-col m-r-50 muted" v-for="(item, index) in columnList" :key="index" @tap="changeActive(index)">
						<view class="xxl normal title" :class="{bold: active == index}">{{item.name}}</view>
						<!-- <view class="m-t-8 xs text-center" :class="{normal : active == index}">{{item.remark}}</view> -->
						<view v-if="active == index" class="line br60"></view>
					</view>
				</view>
			</scroll-view>
			
			<!-- 小标题栏 -->
			<view class="sub-title-wrap">
				<scroll-view scroll-x="true" class="sub-title-scroll">
					<view class="sub-title-list">
						<view 
							class="sub-title-item" 
							v-for="(subItem, subIndex) in subTitleList" 
							:key="subIndex"
							:class="{active: activeSubTitle == subIndex}"
							@tap="changeSubTitle(subIndex)"
						>
							{{subItem.name}}
						</view>
					</view>
				</scroll-view>
				
			</view>
		</view>
		<view class="goods">
			<u-waterfall ref="uWaterfall" v-model="goodsList" :add-time="20">
				<template v-slot:left="{leftList}">
					<view style="padding:0 9rpx 0 30rpx">
						<goods-list width="336rpx" type="waterfall" :list="leftList"></goods-list>
					</view>
				</template>
				<template v-slot:right="{rightList}">
					<view style="padding:0 30rpx 0 9rpx;">
						<goods-list width="336rpx" type="waterfall" :list="rightList"></goods-list>
					</view>
				</template>
			</u-waterfall>
		</view>
	</mescroll-body>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import {
		getGoodsListColumn,
		getGoodsColumn
	} from "@/api/store"

	export default {
		mixins: [MescrollMixin], // 使用mixin
		props:{
			autoGetData: {
				type: Boolean,
				default:true
			} 
		},
		data() {
			return {
				goodsList: [],
				active: 0,
				activeSubTitle: 0,
				columnList: [],
				subTitleList: [
					{ name: '为你推荐' },
					{ name: '手机电器' },
					{ name: '办公设备' }
				],
				upOption: {
					auto: false,
					empty: {
						icon: '/static/images/goods_null.png',
						tip: "暂无商品",
					},
					toTop: {
						bottom: '300rpx' 
					}
				},
				downOption:{use: false, isLock: true},
				hasData: true
			}
		},
		mounted() {
			if(this.autoGetData) {
				this.getData()
			}
		},
		methods: {
			changeSubTitle(index) {
				this.activeSubTitle = index
				// 这里可以根据小标题筛选商品
				console.log('切换小标题:', index)
			},
			async getData() {
				await this.getGoodsColumnFun()
				this.$refs.uWaterfall && this.$refs.uWaterfall.clear();
				this.mescroll.resetUpScroll();
			},
			changeActive(index) {
				this.active = index
				this.$refs.uWaterfall.clear();
				this.mescroll.resetUpScroll();
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				const {columnList, active} = this
				const pageNum = page.num; // 页码, 默认从1开始
				const pageSize = page.size; // 页长, 默认每页10条
				if(!columnList.length) return
				const columnId = columnList[active].id
				const categoryName = columnList[active].name // 获取当前分类名称
				getGoodsListColumn({
					page_size: pageSize,
					page_no: pageNum,
					column_id: columnId
				}).then(({
					data
				}) => {
					let curPageData = data.lists;
					// 给每个商品添加分类名称
					curPageData = curPageData.map(item => ({
						...item,
						categoryName: categoryName
					}))
					let curPageLen = curPageData.length;
					let hasNext = !!data.more;
					if (page.num == 1) this.goodsList = [];
					this.goodsList = this.goodsList.concat(curPageData);
					this.mescroll.endSuccess(curPageLen, hasNext);
				})
			},
			async getGoodsColumnFun() {
				const {
					data,
					code
				} = await getGoodsColumn()
				if (code == 1) {
					this.columnList = data
					this.hasData = data.length ? true : false
				}
			}
		},
		computed: {
			currentCategoryName() {
				const name = this.columnList[this.active] ? this.columnList[this.active].name : ''
				console.log('=== goods-column computed ===')
				console.log('active:', this.active)
				console.log('columnList:', this.columnList)
				console.log('currentCategoryName:', name)
				return name
			}
		}
	}
</script>
<style lang="scss" scoped>
	.goods-column {
		.column-wrap {
			display: inline-block;
			white-space: nowrap;
			padding: 30rpx;

			.item {
				display: inline-block;
				position: relative;
				.title {
					position: relative;
					z-index: 1;
				}
				.line {
					position: absolute;
					top: 48rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 100rpx;
					height: 8rpx;
					background: linear-gradient(90deg, #9DE703 0%, #1F8C03 100%);
					border-radius: 6rpx;
				}
			}
		}
		
		.sub-title-wrap {
			display: flex;
			align-items: center;
			padding: 0 30rpx 20rpx;
			
			.sub-title-scroll {
				flex: 1;
			}
			
			.sub-title-list {
				display: inline-block;
				white-space: nowrap;
				
				.sub-title-item {
					display: inline-block;
					padding: 12rpx 32rpx;
					margin-right: 20rpx;
					background: #FFFFFF;
					border-radius: 8rpx;
					font-size: 28rpx;
					color: #333333;
					transition: all 0.3s;
					
					&.active {
						background: #F0FFF8;
						color: #1B8902;
						font-weight: bold;
					}
				}
			}
		}
	}
</style>
