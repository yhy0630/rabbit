<template>
    <view class="goods-shop">
        <view class="title">
            <router-link
                class="flex-none"
                :to="{ path: '/pages/store_index/store_index', query: { id: shop.id } }"
            >
                <view class="p-20 flex" style="background-color: #f7f8fb; border-radius: 20rpx">
                    <u-image
                        width="100rpx"
                        height="100rpx"
                        border-radius="50%"
                        :src="shop.logo"
                    ></u-image>
                    <view class="flex-1 shop-name m-l-20 m-r-20">
                        <view class="flex">
                            <view class="bold lg line-1">{{ shop.name }}</view>
                            <!-- <view class="store-tag xxs m-t-10 m-l-20 white" v-if="shop.type == 1">
                            自营
                        </view> -->
                        </view>
                        <view class="xs m-t-10">在售商品 {{ shop.goods_on_sale }}件</view>
                    </view>

                    <view class="primary btn br60 sm">进店</view>
                </view>
            </router-link>
        </view>
        <view v-if="list.length">
            <view class="m-20 flex">
                店铺推荐
                <router-link
                    class="flex-none"
                    style="margin-left: auto"
                    :to="{
                        path: '/bundle/pages/shop_search/shop_search',
                        query: { id: shop.id, is_recommend: 1 }
                    }"
                >
                    <view class="flex">
                        <view class="lighter xs">查看全部</view>
                        <u-icon name="arrow-right"></u-icon>
                    </view>
                </router-link>
            </view>
            <scroll-view
                style="white-space: nowrap"
                scroll-x="true"
                scroll-with-animation="true"
                @scroll="scrollBarChange"
            >
                <view class="goods">
                    <goods-list type="row" :list="list"></goods-list>
                </view>
            </scroll-view>
            <view class="flex row-center progress" v-if="list.length > 3">
                <cu-progress
                    :progress-bar-color="colorConfig.primary"
                    :left="progressPer"
                ></cu-progress>
            </view>
        </view>
    </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRect } from '@/utils/tools'
export default {
    data() {
        return {
            progressPer: 0,
            list: []
        }
    },

    props: {
        shop: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        ...mapGetters(['appConfig'])
    },
    watch: {
        shop: {
            handler: function (val) {
                this.list = val.goods_list || []
                this.$nextTick(() => {
                    getRect('.goods-shop', false, this).then((res) => {
                        this.rectWidth = res.width
                    })
                })
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        scrollBarChange(e) {
            let { progressPer } = this
            let { scrollLeft, scrollWidth } = e.detail
            progressPer = (scrollLeft / (scrollWidth - this.rectWidth)) * 100
            progressPer = Number(progressPer.toFixed(0))
            this.progressPer = progressPer
        }
    }
}
</script>
<style lang="scss" scoped>
.goods-shop {
    .title {
        padding: 20rpx;

        .shop-name {
            width: 300rpx;
            .store-tag {
                width: 36px;
                background: linear-gradient(267deg, #ff2c3c 0%, #f52e99 100%);
                border-radius: 6rpx;
                padding: 4rpx 9rpx;
            }
        }

        .btn {
            border: 1px solid $-color-primary;
            padding: 6rpx 28rpx;
        }
    }

    .progress {
        padding-bottom: 20rpx;
    }

    .goods {
        display: inline-block;
        padding: 20rpx;
    }
}
</style>
