<template>
	<view :class="['active-area bg-white', type]">
		<view class="active-hd flex row-between" v-if="title">
			<view class="title-wrapper flex row-center">
				<view class="xxl bold title-text">{{title}}</view>
				<view class="subtitle-text" v-if="type == 'hot'">抢品质好货</view>
			</view>
			<router-link :to="url" v-if="url && type == 'hot'">
				<view class="sm more-link">更多 
					<image class="more-icon" src="/static/picture/right.png" mode="aspectFit"></image>
				</view>
			</router-link>
		</view>

		<view class="active-con">
			<scroll-view style="white-space: nowrap;" :scroll-x="true" v-if="type == 'hot'">
				<view class="goods-wrap">
					<goods-list :show-bg="false" type="row-hot" :list="list"></goods-list>
				</view>
			</scroll-view>
			<goods-list v-if="type == 'new'" type="new" :list="list" :show-bg="false"></goods-list>
		</view>
		<router-link :to="url" v-if="url && type == 'new'">
			<view class="bg-white xs flex row-center more">查看更多 <u-icon name="arrow-right">
				</u-icon>
			</view>
		</router-link>
	</view>
</template>

<script>
	export default {
		name: "active-area",
		props: {
			title: String,
			url: String,
			list: {
				type: Array,
				default: () => ([])
			},
			type: String
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.active-area {
		background-size: 100% auto;
		background-repeat: no-repeat;
		border-radius: 14rpx;
		overflow: hidden;

		&.new {
			background-image: url(../../static/images/index_new_bg.png);
		}

		&.hot {
			background: linear-gradient(180deg, rgba(0, 223, 19, 0.65) 20%, rgba(155, 242, 162, 0.65) 30%, rgba(255, 255, 255, 0.65) 36%);
			border:2rpx solid #5df43E;
		}

		.active-hd {
			padding: 24rpx 20rpx;
			
			.title-wrapper {
				gap: 16rpx;
			}
			
			.title-text {
				color: #FFF;
				-webkit-text-stroke: 0.5rpx #5DFE3E;
				text-stroke: 0.5rpx #5DFE3E;
				paint-order: stroke fill;
			}
			
			.subtitle-text {
				font-size: 24rpx;
				color: #FFF;
				position: relative;
				top: 8rpx;
			}
			
			.more-link {
				color: #FFF;
				display: flex;
				align-items: center;
				
				.more-icon {
					width: 36rpx;
					height: 36rpx;
					margin-left: 4rpx;
				}
			}
		}

		.goods-wrap {
			padding: 0 20rpx 20rpx;
			display: inline-block;
		}

		.more {
			height: 80rpx;
			border-top: $-solid-border;
		}
	}
</style>
