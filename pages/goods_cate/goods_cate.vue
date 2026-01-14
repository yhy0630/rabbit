<template>
	<view class="goods-cate">
		<custom-navbar title="分类" :show-back="false"></custom-navbar>
		<router-link to="/pages/goods_search/goods_search">
			<view class="header" :style="{ marginTop: navbarHeight + 'px' }">
				<u-search bg-colo
				r="#FFF" :disabled="true" :show-publish-icon="true"></u-search>
			</view>
		</router-link>
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
</style>
