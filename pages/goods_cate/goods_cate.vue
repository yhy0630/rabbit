<template>
	<view class="goods-cate">
		<custom-navbar title="分类" :show-back="false"></custom-navbar>
		<view class="search-wrapper" :style="{ marginTop: navbarHeight + 'px' }">
			<router-link to="/pages/goods_search/goods_search">
				<view class="search-box">
					<text class="search-text">请输入商品名称</text>
				</view>
			</router-link>
		</view>
		<view class="content" v-if="appConfig.cate_style == 1 || appConfig.cate_style == 4">
			<cate-two :cate-list="cateList"></cate-two>
		</view>
		<view class="content bg-body" v-if="appConfig.cate_style == 3 || appConfig.cate_style == 2">
			<cate-one :cate-list="cateList"></cate-one>
		</view>
		<custom-tabbar :current="1"></custom-tabbar>
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
		try {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight || 0;
			this.navbarHeight = this.statusBarHeight + 44;
		} catch (e) {
			console.error('获取系统信息失败:', e);
			this.statusBarHeight = 20;
			this.navbarHeight = 64;
		}
		this.getLevelOneListFun();
	},
	onShow() {
		this.getCartNum();
	},
	methods: {
		...mapActions(['getCartNum']),
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
page {
	background-color: #fff;
	height: 100%;
}

.goods-cate {
	height: 100%;
	
	.search-wrapper {
		padding: 20rpx;
		background: #B3EE76;
		
		.search-box {
			background: #FFFFFF;
			border-radius: 60rpx;
			padding: 20rpx 30rpx;
			
			.search-text {
				color: #999999;
				font-size: 28rpx;
			}
		}
	}

	.content {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		margin-top: 30rpx;
	}
}
</style>
