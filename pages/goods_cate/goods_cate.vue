<template>
	<view class="goods-cate">
		<custom-navbar title="二手交易" :show-back="false"></custom-navbar>
		<router-link to="/pages/goods_search/goods_search">
			<view class="header" :style="{ marginTop: navbarHeight + 'px' }">
				<u-search bg-color="#FFF" :disabled="true" :show-publish-icon="true"></u-search>
			</view>
		</router-link>
		<view class="content" v-if="appConfig.cate_style == 1 || appConfig.cate_style == 4">
			<cate-two :cate-list="cateList"></cate-two>
		</view>
		<view class="content bg-body" v-if="appConfig.cate_style == 3 || appConfig.cate_style == 2">
			 <cate-one  :listType="'yhy'" :cate-list="cateList"></cate-one>
		</view>
		<custom-tabbar :current="1"></custom-tabbar>

		<!-- 悬浮：投诉/建议 -->
		<view class="float-report" @tap="handleReport">
			<image 
				src="/static/picture/Frame 1171275731.png" 
				class="float-report-icon"
				mode="aspectFit"
			></image>
			<text class="float-report-text">投诉/建议</text>
		</view>
	</view>
</template>

<script>
import { getLevelOneList } from '@/api/store';
import { mapGetters, mapActions } from 'vuex';
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue';
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue';

export default {
	components: {
		CustomTabbar,
		CustomNavbar
	},
	data() {
		return {
			cateList: [],
			cateTwoList: [],
			selectIndex: 0,
			statusBarHeight: 0,
			navbarHeight: 0
		};
	},
	async onLoad() {
		const systemInfo = uni.getSystemInfoSync();
		this.statusBarHeight = systemInfo.statusBarHeight || 0;
		this.navbarHeight = this.statusBarHeight + 44;
		this.getLevelOneListFun();
	},
	onShow() {
		this.getCartNum();
	},
	methods: {
		...mapActions(['getCartNum']),
		handleReport() {
			// 悬浮投诉/建议按钮（与首页保持一致）
			console.log('点击投诉/建议');
			// TODO: 有具体页面时，可改为 uni.navigateTo({ url: '...' })
		},
		async getLevelOneListFun() {
			const { code, data } = await getLevelOneList();
			if (code == 1) {
				this.cateList = data;
			}
		}
	},
	computed: {
		...mapGetters(['inviteCode', 'appConfig'])
	}
};
</script>

<style lang="scss" scoped>
$header-height: 94rpx;

page {
	background-color: #fff;
	height: 100%;
}

.goods-cate {
	height: 100%;
	
	.header {
		box-sizing: border-box;
		height: $header-height;
		border-bottom: 1px solid #e5e5e5;
	}

	.content {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		margin-top: 30rpx;
	}
}

/* 悬浮投诉/建议按钮（与首页保持一致） */
.float-report {
	position: fixed;
	right: 24rpx;
	top: 50%;
	transform: translateY(-50%);
	z-index: 1201; /* 高于 u-no-network(1200) */
	width: 120rpx;
	padding: 10rpx 10rpx;
	border-radius: 16rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.float-report-icon {
	width: 90rpx;
	height: 90rpx;
}

.float-report-text {
	margin-top: 6rpx;
	font-size: 20rpx;
	color: #289301;
	white-space: nowrap;
	font-weight: bold;
}
</style>
