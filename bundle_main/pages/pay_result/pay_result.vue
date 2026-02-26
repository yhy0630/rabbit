<template>
    <view class="pay-result">
        <!-- 自定义导航栏 -->
        <custom-navbar title="支付结果"></custom-navbar>
        
        <view class="contain bg-white">
            <view class="header flex-col col-center">
                <view>
                    <image class="tips-icon" src="/static/images/icon_success.png"></image>
                </view>
                <view class="xl m-t-20" v-if="payInfo.pay_way == '线下支付'">订单创建成功</view>
                <view class="xl m-t-20" v-else>订单支付成功</view>
            </view>
            <view class="info">
                <view class="order-num flex row-between m-t-20">
                    <view>订单编号</view>
                    <view>
                        {{ payInfo.order_sn }}
                    </view>
                </view>
                <view
                    v-if="payInfo.pay_time && payInfo.pay_way != '线下支付'"
                    class="order-time flex row-between m-t-20"
                >
                    <view>付款时间</view>
                    <view>{{ payInfo.pay_time }}</view>
                </view>
                <view
                    v-if="payInfo.pay_time && payInfo.pay_way == '线下支付'"
                    class="order-time flex row-between m-t-20"
                >
                    <view>下单时间</view>
                    <view>{{ payInfo.pay_time }}</view>
                </view>
                <view class="order-pay-type flex row-between m-t-20">
                    <view>支付方式</view>
                    <view>{{ payInfo.pay_way }}</view>
                </view>
                <view class="order-pay-money flex row-between m-t-20">
                    <view>支付金额</view>
                    <view>
                        {{ payInfo.total_amount }}
                    </view>
                </view>
            </view>
            <view class="line m-t-40"></view>
            <view class="m-t-40 flex-col row-center">
                <button type="primary" size="lg" class="br60" @click="goToOrder">查看订单</button>
                <button size="lg" class="br60 plain primary m-t-30" @click="backHome">返回首页</button>
            </view>
        </view>
    </view>
</template>

<script>
import { getPayResult } from '@/api/order'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    components: {
        CustomNavbar
    },
    data() {
        return {
            payInfo: {},
            from: ''
        }
    },

    onLoad(options) {
        console.log('[pay_result页面调试] 支付结果页面 onLoad 被调用');
        console.log('[pay_result页面调试] onLoad 接收到的 options 参数:', options);
        console.log('[pay_result页面调试] options 类型:', typeof options);
        console.log('[pay_result页面调试] options 键值:', Object.keys(options || {}));
        
        // 优先使用 onLoad 的 options 参数，如果没有则尝试使用 $Route.query（兼容路由跳转）
        let routeOptions = options || {};
        if (this.$Route && this.$Route.query) {
            console.log('[pay_result页面调试] $Route.query 存在:', this.$Route.query);
            // 如果 options 为空或没有关键参数，尝试使用 $Route.query
            if (!routeOptions.id && !routeOptions.from) {
                routeOptions = this.$Route.query;
                console.log('[pay_result页面调试] 使用 $Route.query 作为参数源');
            }
        } else {
            console.log('[pay_result页面调试] $Route.query 不存在或未初始化');
        }
        
        console.log('[pay_result页面调试] 最终使用的路由参数:', routeOptions);
        
        this.id = routeOptions.id || routeOptions.order_id;
        this.from = routeOptions.from || 'trade';
        
        console.log('[pay_result页面调试] 解析后的参数:');
        console.log('[pay_result页面调试] - this.id:', this.id);
        console.log('[pay_result页面调试] - this.from:', this.from);
        
        if (!this.id) {
            console.error('[pay_result页面调试] 订单ID为空，无法获取支付结果');
            uni.showToast({
                title: '订单ID不能为空',
                icon: 'none'
            });
            setTimeout(() => {
                this.$Router.back();
            }, 1500);
            return;
        }
        
        console.log('[pay_result页面调试] 开始获取订单结果');
        this.getOrderResultFun();
    },

    methods: {
        getOrderResultFun() {
            console.log('[pay_result页面调试] getOrderResultFun 开始执行');
            console.log('[pay_result页面调试] - id:', this.id);
            console.log('[pay_result页面调试] - from:', this.from);
            
            const params = {
                id: this.id,
                from: this.from,
                order_id: this.id  // 兼容 order_id 参数
            };
            console.log('[pay_result页面调试] 调用 getPayResult API，参数:', params);
            
            getPayResult(params).then((res) => {
                console.log('[pay_result页面调试] getPayResult API 返回结果:', res);
                if (res.code == 1) {
                    this.payInfo = res.data;
                    console.log('[pay_result页面调试] 支付信息设置成功:', this.payInfo);
                } else {
                    console.error('[pay_result页面调试] getPayResult API 返回失败，code:', res.code, 'msg:', res.msg);
                    uni.showToast({
                        title: res.msg || '获取支付结果失败',
                        icon: 'none'
                    });
                }
            }).catch((err) => {
                console.error('[pay_result页面调试] getPayResult API 调用出错:', err);
                uni.showToast({
                    title: '获取支付结果失败',
                    icon: 'none'
                });
            });
        }
        ,
        goToOrder() {
            const target = this.getPagesUrl
            if (!target) return
            uni.navigateTo({
                url: target,
                fail: () => {
                    // fallback to redirectTo
                    uni.redirectTo({
                        url: target,
                        fail: () => {
                            // last resort: reLaunch
                            uni.reLaunch({ url: target })
                        }
                    })
                }
            })
        },
        backHome() {
            uni.reLaunch({
                url: '/pages/index/index',
                fail: () => {
                    uni.navigateTo({ url: '/pages/index/index' })
                }
            })
        }
    },
    computed: {
        getPagesUrl() {
            switch (this.from) {
                case 'integral':
                    return '/bundle/pages/exchange_order/exchange_order'
                case 'home_service':
                    return '/bundle_home_service/pages/service_order_list/service_order_list'
                default:
                    return '/bundle/pages/user_order/user_order'
            }
        }
    }
}
</script>
<style lang="scss">
.pay-result {
    padding-top: 88px; // 为固定定位的导航栏留出空间
    
    .contain {
        border-radius: 10rpx;
        padding: 0 30rpx 40rpx;
        position: relative;
        margin: 78rpx 20rpx 0;
        .tips-icon {
            width: 112rpx;
            height: 112rpx;
        }

        .header {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: -50rpx;
        }
        .info {
            padding-top: 180rpx;
        }
        .line {
            border-top: $-solid-border;
        }
        .plain {
            border: 1px solid $-color-primary;
        }
        /* 自定义：查看订单按钮渐变背景 */
        button[type="primary"] {
            background: linear-gradient(91.58deg, #49AB02 15.84%, #E4E872 83.36%, #EFFD6B 96.79%);
            color: #FFFFFF;
            border: none;
        }
        /* 自定义：返回首页 按钮 字体与边框颜色 */
        button.plain {
            color: #149906;
            border-color: #149906;
        }
    }
}
</style>
