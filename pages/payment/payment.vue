<template>
    <view class="payment-pages">
        <view class="payment u-skeleton">
            <!-- Header -->
            <view class="payment-header">
                <price-format
                    class="u-skeleton-fillet"
                    :subscript-size="40"
                    :first-size="56"
                    :second-size="40"
                    :price="amount"
                    :weight="500"
                />
                <template v-if="timeout > 0">
                    <view class="payment-count-down">
                        <text>支付剩余时间</text>
                        <u-count-down
                            :timestamp="timeout"
                            :show-days="false"
                            :show-hours="false"
                            :font-size="22"
                        />
                    </view>
                </template>
            </view>

            <!-- Main -->
            <view class="payment-main">
                <view class="payway-container u-skeleton-fillet flex">
                    <!-- Payway -->
                    <u-radio-group v-model="payway" class="flex-1">
                        <view class="payway">
                            <view
                                class="payway-item"
                                v-for="item in paywayList"
                                :key="item.id"
                                @click="changePayway(item.pay_way)"
                            >
                                <u-image
                                    :src="item.image"
                                    width="48"
                                    height="48"
                                    mode="scaleToFill"
                                />
                                <view class="payway-item-content">
                                    <text class="payway-item-content-name">{{ item.name }}</text>
                                    <text class="payway-item-content-tips">{{ item.extra }}</text>
                                </view>
                                <u-radio
                                    shape="circle"
                                    :name="item.pay_way"
                                    active-color="#149906"
                                />
                            </view>
                        </view>
                    </u-radio-group>
                    <template v-if="!paywayList.length">
                        <view class="payway-empty">暂无支付方式</view>
                    </template>
                </view>
            </view>

            <!-- Footer -->
            <view class="payment-footer">
                <view
                    :class="{ 'payment-submit--disabled': loadingPay }"
                    class="payment-submit"
                    @tap="handlePrepay"
                >
                    <u-loading mode="circle" :show="loadingPay" />
                    <text v-show="!loadingPay">立即支付</text>
                </view>
            </view>
        </view>
        <u-popup
            v-model="Alipayshow"
            mode="bottom"
            height="600rpx"
            safe-area-inset-bottom
            border-radius="20"
            closeable
            @close="handleclose"
        >
            <view class="Alipay">
                <view class="m-t-50">
                    <price-format
                        class="u-skeleton-fillet"
                        :subscript-size="40"
                        :first-size="56"
                        :second-size="40"
                        :price="amount"
                        :weight="500"
                    />
                </view>
                <view class="flex row-between m-t-50" style="width: 100%">
                    <text class="bold">支付方式</text>
                    <text class="bold">支付宝</text>
                </view>
                <view class="p-20 m-t-50 m-b-50" style="width: 100%; background-color: #f7f7f7"
                    >请复制链接,粘贴至浏览器并支付
                    <view style="color: red; font-size: 20rpx">
                        (为了账户安全，请勿分享此链接)
                    </view>
                </view>

                <button class="btn" @click="oncopy">复制链接</button>
            </view>
        </u-popup>
        <u-skeleton :loading="loadingSkeleton" :animation="true" bgColor="#FFF" />
    </view>
</template>

<script>
/**
 * @description 支付页面
 * @query {String} from 订单来源: order-商品订单; recharge-充值订单;
 * @query {Number} order_id	订单ID
 */
import { prepay, getPayway } from '@/api/app'
import { wxpay, alipay } from '@/utils/pay'
import { getPayResult } from '@/api/order'
import { getUserInfo } from '@/api/user'
import { copy } from '@/utils/tools'

export default {
    name: 'Payment',

    data() {
        return {
            from: '', // 订单来源
            order_id: '', // 订单ID
            amount: 0, // 支付金额
            timeout: 0, // 倒计时间戳
            payway: '', // 支付方式
            paywayList: [], // 支付方式列表
            showAgain: false,
            loadingSkeleton: true, // 骨架屏Loading
            loadingPay: false, // 支付处理中Loading
            Alipayshow: false,
            userInfo: {},
            key: ''
        }
    },

    methods: {
        // 更改支付方式
        changePayway(value) {
            this.$set(this, 'payway', value)
        },
        oncopy() {
            copy(this.key)
        },
        handleclose() {
            getPayResult({
                from: this.from,
                order_id: this.order_id,
                id: this.order_id
            }).then(({ data }) => {
                if (data.pay_status) {
                    this.result = 'success'
                } else {
                    this.result = 'fail'
                }
                this.$Router.back(1)
            })
        },
        // 初始化页面数据
        initPageData() {
            // 获取支付方式
            getPayway({
                from: this.from,
                order_id: this.order_id
            })
                .then((res) => {
                    if (res.code != 1) {
                        // API 调用失败时，至少保留 URL 参数中的金额
                        this.loadingSkeleton = false
                        if (this.amount <= 0) {
                            throw new Error(res.msg || '获取支付信息失败')
                        }
                        // 如果金额存在，至少显示金额，支付方式列表为空
                        this.paywayList = []
                        return
                    }
                    return res.data
                })
                .then((data) => {
                    if (!data) return // 如果 data 为空（API 失败但金额存在的情况），直接返回
                    
                    this.loadingSkeleton = false
                    // 优先使用 API 返回的金额，如果 API 返回的金额为 0 或无效，则使用 URL 参数中的金额
                    const apiAmount = parseFloat(data.order_amount) || 0
                    this.amount = apiAmount > 0 ? apiAmount : (this.amount || 0)
                    this.paywayList = data.pay_way || []
                    this.payway = this.paywayList[0]?.pay_way || ''
                    // 倒计时
                    const startTimestamp = new Date().getTime()
                    const endTimestamp = data.cancel_time || 0
                    this.timeout = endTimestamp > 0 ? (endTimestamp - startTimestamp / 1000) : 0
                })
                .catch((err) => {
                    this.loadingSkeleton = false
                    console.error('获取支付信息失败:', err)
                    // 如果金额存在，至少显示金额
                    if (this.amount <= 0) {
                        uni.showToast({
                            title: err.message || '获取支付信息失败',
                            icon: 'none'
                        })
                        setTimeout(() => {
                            this.$Router.back()
                        }, 1500)
                    }
                })
        },

        // 预支付处理
        handlePrepay() {
            if (this.loadingPay) return
            this.loadingPay = true
            // #ifdef MP-WEIXIN

            if (this.userInfo.mnp_auth == 0 && this.payway == 1) {
                uni.showModal({
                    content: '当前账号未微信授权，请前往个人设置授权',
                    confirmText: '前往授权',
                    success: ({ confirm }) => {
                        if (confirm) {
                            this.$Router.replaceAll({
                                path: '/bundle/pages/user_set/user_set',
                                query: {
                                    form: 'payment'
                                }
                            })
                        }
                    }
                })
                return
            }
            //    #endif
            //  #ifdef H5
            if (this.userInfo.oa_auth == 0 && this.payway == 1) {
                uni.showModal({
                    content: '当前账号未微信授权，请前往个人设置授权',
                    confirmText: '前往授权',
                    success: ({ confirm }) => {
                        if (confirm) {
                            this.$Router.replaceAll({
                                path: '/bundle/pages/user_set/user_set',
                                query: {
                                    form: 'payment'
                                }
                            })
                        }
                    }
                })
                return
            }
            //    #endif

            prepay(
                {
                    from: this.from,
                    order_id: this.order_id,
                    pay_way: this.payway
                },
                this.$store.getters.token
            )
                .then(({ code, data, pay_way }) => {
                    switch (code) {
                        case 1:
                            this.handleWechatPay(data)
                            break
                        case 10001:
                            this.handleAlipayPay(data, pay_way)
                            break
                        case 20001:
                            this.handleWalletPay()
                            break
                        case 30001:
                            this.handledownPay()
                            break
                    }
                })
                .catch((err) => {})
                .finally(() => {
                    setTimeout(() => {
                        this.loadingPay = false
                    }, 500)
                })
        },

        // 微信支付
        handleWechatPay(data) {
            wxpay(data)
                .then((res) => {
                    console.log(res)
                    this.handPayResult(res)
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 支付宝支付
        handleAlipayPay(data, pay_way) {
            this.key = `${this.$store.state.app.config.base_domain}mobile/bundle/pages/toAlipay/toAlipay?id=${this.order_id}&from=${this.from}&pay_way=${this.payway}&key=${this.$store.getters.token}`
            uni.$on('Alipay', () => {
                this.Alipayshow = true
            })
            alipay(
                data,
                pay_way,
                {
                    order_id: this.order_id,
                    from: this.from,
                    pay_way: this.payway
                },
                this.$store.getters.token
            )
                .then((res) => {
                    console.log(res)
                    this.handPayResult(res)
                })
                .catch((err) => {
                    console.log(err)
                })
        },

        // 钱包余额支付
        handleWalletPay() {
            console.log('支付成功')
            //余额支付成功
            this.handPayResult('success')
        },
        // 线下支付
        handledownPay() {
            console.log('支付成功')
            //支付成功
            this.handPayResult('success')
        },
        getUserInfoFun() {
            getUserInfo().then((res) => {
                if (res.code == 1) {
                    this.userInfo = res.data
                }
            })
        },
        // 支付后处理
        handPayResult(result) {
            // 记录支付结果
            this.result = result
            // 支付成功后跳转到支付结果页面
            if (result === 'success') {
                this.$Router.replaceAll({
                    path: '/pages/pay_result/pay_result',
                    query: {
                        id: this.order_id,
                        from: this.from
                    }
                })
            } else {
                // 支付失败，返回上一页
                this.$Router.back(1)
            }
        }
    },

    onLoad() {
        const options = this.$Route.query
        // 支持 from 参数，如果没有则尝试使用 type 参数（兼容旧版本）
        const from = options?.from || options?.type || 'trade'
        const order_id = options?.order_id
        // 从 URL 参数中读取金额作为备用值
        const amountFromUrl = options?.amount ? parseFloat(options.amount) : 0
        
        this.getUserInfoFun()

        try {
            if (!from && !order_id) throw new Error('页面参数有误')
            this.from = from
            this.order_id = order_id
            // 如果 URL 中有金额参数，先设置一个备用值，等 API 返回后再更新
            if (amountFromUrl > 0) {
                this.amount = amountFromUrl
            }
            this.initPageData()
        } catch (err) {
            console.log(err)
            // uni.navigateBack()
            this.$Router.back()
        }
    },
    onShow() {
        if (this.showAgain) {
            getPayResult({
                from: this.from,
                order_id: this.order_id,
                id: this.order_id
            }).then(({ data }) => {
                if (data.pay_status) {
                    this.result = 'success'
                } else {
                    this.result = 'fail'
                }
                this.$Router.back(1)
            })
        }
    },
    onHide() {
        this.showAgain = true
    },

    onUnload() {
        switch (this.result) {
            case 'success':
                uni.$emit('payment', {
                    result: true,
                    order_id: this.order_id,
                    from: this.from
                })
                break
            case 'fail':
            default:
                uni.$emit('payment', {
                    result: false,
                    order_id: this.order_id,
                    from: this.from
                })
        }
    }
}
</script>

<style lang="scss">
page {
    height: 100%;
    padding: 0;
    background: #F1F7F2;
}
.payment-pages {
    height: 100%;
    .payment {
        display: flex;
        flex-direction: column;
        height: calc(100% - env(safe-area-inset-bottom));

        &-header {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 300rpx;
            // background: linear-gradient(270deg, #ff2c3c 0%, #f95f2f 100%);
            color: #000;
        }

        &-main {
            flex: 1;
            margin-top: -40rpx;
            padding: 0 20rpx;
            overflow: hidden;
        }

        &-footer {
            display: flex;
            align-items: center;
            height: 100rpx;
            padding: 0 20rpx;
            background-color: #ffffff;
        }

        .payway-container {
            padding: 0 20rpx;
            border-radius: 7px;
            background-color: #ffffff;

            .payway-empty {
                width: 100%;
                display: flex;
                justify-content: center;
                padding: 20rpx 0;
                font-size: 26rpx;
                color: $-color-muted;
            }
        }

        .payway {
            width: 100%;

            &-item {
                display: flex;
                align-items: center;
                height: 120rpx;
                &:nth-child(n + 2) {
                    border-top: $-dashed-border;
                }

                &-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    margin-left: 16rpx;

                    &-name {
                        font-size: 28rpx;
                        color: $-color-black;
                    }

                    &-tips {
                        font-size: 22rpx;
                        color: $-color-muted;
                    }
                }
            }
        }

        &-count-down {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 7rpx 25rpx;
            border-radius: 60px;
            margin-top: 10rpx;
            font-size: 22rpx;
            background-color: #ffffff;
            color: $-color-normal;
        }

        &-submit {
            flex: 1;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 74rpx;
            font-size: 28rpx;
            border-radius: 60px;
            background: linear-gradient(91.58deg, #49AB02 15.84%, #E4E872 83.36%, #EFFD6B 96.79%);
            color: #ffffff;

            &--disabled::before {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                height: 100%;
                display: block;
                content: '';
                background: rgba(255, 255, 255, 0.3) !important;
            }
        }
    }
}
.Alipay {
    padding: 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .btn {
        background: linear-gradient(270deg, #ff2c3c 0%, #f95f2f 100%);

        border-radius: 12rpx;
        width: 100%;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 28rpx;
        color: white;
    }
}
</style>
