<!-- 提现 -->

<template>
    <view class="user-withdraw">
        <custom-navbar title="申请提现"></custom-navbar>
        
        <!-- 提现金额 -->
        <view class="withdraw-money-section m-t-20 bg-white">
            <view class="money-header flex row-between">
                <text class="money-title">提现金额</text>
                <text class="money-detail-link" @tap="goToWithdrawDetail">提现明细</text>
            </view>
            <view class="money-input-box">
                <text class="money-symbol">¥</text>
                <u-input
                    v-model="form.money"
                    placeholder="请输入自定义金额"
                    :custom-style="{
                        'font-size': '32rpx',
                        'color': '#999999'
                    }"
                    placeholder-style="color: #999999"
                />
            </view>
            <view class="money-footer flex row-between">
                <text class="balance-text">可提现余额:¥{{ widthDrawConfig.able_withdraw || '0.00' }}</text>
                <text class="withdraw-all-link" @tap="form.money = widthDrawConfig.able_withdraw">全部提现</text>
            </view>
        </view>

        <!-- 选择提现账户 -->
        <view class="withdraw-account-section m-t-20 bg-white">
            <view class="account-header">
                <view class="account-header-bar"></view>
                <text class="account-title">选择提现账户</text>
            </view>
            
            <u-radio-group v-model="currentValue" @change="changeTab">
                <!-- 微信 -->
                <view class="account-item" @tap="selectAccount(3)">
                    <view class="account-item-left flex">
                        <image class="account-icon" src="/static/images/weixinzhifu 1 (1).png" mode="aspectFit"></image>
                        <view class="account-info">
                            <text class="account-name">提现至微信</text>
                            <text class="account-hint">请设置提现账户 ></text>
                        </view>
                    </view>
                    <u-radio :name="3" active-color="#189B07"></u-radio>
                </view>
                
                <!-- 支付宝 -->
                <view class="account-item" @tap="selectAccount(4)">
                    <view class="account-item-left flex">
                        <image class="account-icon" src="/static/images/zhifubao 2.png" mode="aspectFit"></image>
                        <view class="account-info">
                            <text class="account-name">提现至支付宝</text>
                            <text class="account-hint">请设置提现账户 ></text>
                        </view>
                    </view>
                    <u-radio :name="4" active-color="#189B07"></u-radio>
                </view>
                
                <!-- 银行卡 -->
                <view class="account-item" @tap="selectAccount(5)">
                    <view class="account-item-left flex">
                        <image class="account-icon" src="/static/images/qianbao 1.png" mode="aspectFit"></image>
                        <view class="account-info">
                            <text class="account-name">提现至银行卡</text>
                            <text class="account-hint">请设置提现账户 ></text>
                        </view>
                    </view>
                    <u-radio :name="5" active-color="#189B07"></u-radio>
                </view>
            </u-radio-group>
        </view>

        <!-- 微信钱包表单 -->
        <view v-if="currentValue == 3" class="withdraw-form m-t-20 bg-white">
            <!-- Account -->
            <u-field
                label-width="160"
                label="微信账号"
                v-model="form.account"
                placeholder="请输入微信账号"
            />
            <!-- Name -->
            <u-field
                label-width="160"
                label="真实姓名"
                v-model="form.real_name"
                placeholder="请输入真实姓名"
            />
            <!-- Remark -->
            <u-field label-width="160" label="备注" v-model="form.remark" placeholder="(选填)" />

            <!-- 上传图片 -->
            <view class="flex-col m-t-20">
                <u-upload
                    ref="uUpload"
                    :header="{ token: $store.getters.token }"
                    :auto-upload="true"
                    :show-progress="false"
                    max-count="1"
                    width="142"
                    height="142"
                    :custom-btn="true"
                    :action="action"
                    @on-success="onSuccess"
                    @on-remove="onRemove"
                >
                    <view slot="addBtn" class="flex-col col-center row-center">
                        <view class="upload-image flex-col col-center row-center">
                            <u-icon name="/bundle/static/icon_camera_line.png" width="54" />
                        </view>

                        <view class="xs m-t-10">微信收款码</view>
                    </view>
                </u-upload>
            </view>
        </view>

        <!-- 支付宝表单 -->
        <view v-else-if="currentValue == 4" class="withdraw-form m-t-20 bg-white">
            <!-- Account -->
            <u-field
                label-width="160"
                label="支付宝账号"
                v-model="form.account"
                placeholder="请输入支付宝账号"
            />
            <!-- Name -->
            <u-field
                label-width="160"
                label="真实姓名"
                v-model="form.real_name"
                placeholder="请输入真实姓名"
            />
            <!-- Remark -->
            <u-field label-width="160" label="备注" v-model="form.remark" placeholder="(选填)" />

            <!-- 上传图片 -->
            <view class="flex-col m-t-20">
                <u-upload
                    ref="uUpload"
                    :header="{ token: $store.getters.token }"
                    :auto-upload="true"
                    :show-progress="false"
                    max-count="1"
                    width="142"
                    height="142"
                    :custom-btn="true"
                    :action="action"
                    @on-success="onSuccess"
                    @on-remove="onRemove"
                >
                    <view slot="addBtn" class="flex-col col-center row-center">
                        <view class="upload-image flex-col col-center row-center">
                            <u-icon name="/bundle/static/icon_camera_line.png" width="54" />
                        </view>

                        <view class="xs m-t-10">支付宝收款码</view>
                    </view>
                </u-upload>
            </view>
        </view>

        <!-- 银行卡表单 -->
        <view v-else-if="currentValue == 5" class="withdraw-form m-t-20 bg-white">
            <!-- Account -->
            <u-field
                label-width="160"
                label="银行卡账号"
                v-model="form.account"
                placeholder="请输入银行卡账号"
            />
            <!-- Name -->
            <u-field
                label-width="160"
                label="持卡人姓名"
                v-model="form.real_name"
                placeholder="请输入持卡人姓名"
            />
            <!-- Name -->
            <u-field
                label-width="160"
                label="提现银行"
                v-model="form.bank"
                placeholder="请输入银行名称"
            />
            <!-- Remark -->
            <u-field
                label-width="160"
                label="银行支行"
                v-model="form.subbank"
                placeholder="如：金湾支行"
            />
            <!-- Remark -->
            <u-field label-width="160" label="备注" v-model="form.remark" placeholder="(选填)" />
        </view>

        <!-- 立即提现 -->
        <button class="withdraw-submit m-t-30 white br60" @tap="onSubmit" size="lg">
            立即提现
        </button>

        <!-- 提现记录 -->
        <router-link to="/bundle/pages/user_withdraw_code/user_withdraw_code">
            <view class="withdraw-log m-t-40 text-center muted">提现记录</view>
        </router-link>
    </view>
</template>

<script>
import { applyWithdraw, getWithdrawConfig } from '@/api/user'
import { trottle } from '@/utils/tools'
import { getMnpNotice } from '@/api/app'
import { baseURL } from '@/config/app'

export default {
    data() {
        return {
            action: baseURL + '/api/file/formimage',
            currentValue: 4, // 当前选择的账户类型，默认支付宝
            // 表单数据
            form: {
                money: '', // 提现金额
                account: '', // 账户名称
                real_name: '', // 真实姓名
                money_qr_code: '', // 收款二维码
                bank: '', // 银行
                subbank: '', // 支行
                remark: '' // 备注
            },
            widthDrawConfig: {}
        }
    },
    onLoad() {
        this.getWithdrawConfigFun()
        this.onSubmit = trottle(this.onSubmit, 1000, this)
    },
    methods: {
        // 获取微信授权
        authWechatMessage() {
            return new Promise((resolve, reject) => {
                getMnpNotice({
                    scene: 113
                })
                    .then(({ code, data, msg }) => {
                        if (code != 1) throw new Error(msg)
                        return data
                    })
                    .then((data) => {
                        if (!data.length) return reject()
                        uni.requestSubscribeMessage({
                            tmplIds: data,
                            success(res) {
                                resolve(res)
                            },
                            fail(err) {
                                reject(err)
                            }
                        })
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        },
        // 选择账户
        selectAccount(value) {
            this.currentValue = value
            this.form = {
                money: '',
                account: '',
                real_name: '',
                money_qr_code: '',
                remark: '',
                bank: '',
                subbank: ''
            }
        },
        // 改变账户类型
        changeTab(value) {
            this.currentValue = value
            this.form = {
                money: '',
                account: '',
                real_name: '',
                money_qr_code: '',
                remark: '',
                bank: '',
                subbank: ''
            }
        },
        async getWithdrawConfigFun() {
            const { code, data } = await getWithdrawConfig()

            if (code == 1) {
                this.widthDrawConfig = data
                // 如果有配置的账户类型，设置默认值
                if (data.type && data.type.length > 0) {
                    // 优先选择支付宝，如果没有则选择第一个
                    const alipayType = data.type.find(item => item.value == 4)
                    if (alipayType) {
                        this.currentValue = 4
                    } else {
                        this.currentValue = data.type[0].value
                    }
                }
            }
        },
        // 跳转到提现明细
        goToWithdrawDetail() {
            uni.navigateTo({
                url: '/bundle/pages/user_withdraw_code/user_withdraw_code'
            })
        },
        // 提交表单
        onSubmit() {
            const data = {
                ...this.form
            }
            data.type = this.currentValue

            if (!data.money) {
                this.$toast({
                    title: '请输入提现金额'
                })
                return
            }
            // #ifdef MP
            if (data.type == 2) {
                this.authWechatMessage().catch((err) => {
                    console.log(err)
                })
            }
            // #endif
            applyWithdraw(data).then((res) => {
                if (res.code == 1) {
                    this.$toast(
                        {
                            title: '提交成功'
                        },
                        {
                            tab: 2,
                            url: '/bundle/pages/widthdraw_result/widthdraw_result?id=' + res.data.id
                        }
                    )
                }
            })
        },
        onSuccess(e) {
            console.log(e)
            this.form.money_qr_code = e.data.base_uri
        },
        onRemove(index) {
            this.form.money_qr_code = ''
        }
    },
}
</script>

<style lang="scss" scoped>
.user-withdraw {
    padding: 20rpx 30rpx;
    padding-top: 88px; // Account for fixed navbar height (statusBar + navbar)
    min-height: 100vh;
    background-color: #F5F5F5;

    .withdraw-money-section {
        padding: 30rpx;
        border-radius: 20rpx;

        .money-header {
            margin-bottom: 30rpx;

            .money-title {
                font-size: 32rpx;
                font-weight: 600;
                color: #333333;
            }

            .money-detail-link {
                font-size: 28rpx;
                color: #999999;
            }
        }

        .money-input-box {
            display: flex;
            align-items: center;
            background-color: #F5F5F5;
            border-radius: 10rpx;
            padding: 20rpx 30rpx;
            margin-bottom: 20rpx;

            .money-symbol {
                font-size: 32rpx;
                color: #333333;
                margin-right: 10rpx;
            }
        }

        .money-footer {
            .balance-text {
                font-size: 24rpx;
                color: #999999;
            }

            .withdraw-all-link {
                font-size: 28rpx;
                color: #189B07;
            }
        }
    }

    .withdraw-account-section {
        padding: 30rpx;
        border-radius: 20rpx;

        .account-header {
            display: flex;
            align-items: center;
            margin-bottom: 30rpx;

            .account-header-bar {
                width: 6rpx;
                height: 32rpx;
                background-color: #189B07;
                border-radius: 3rpx;
                margin-right: 12rpx;
            }

            .account-title {
                font-size: 32rpx;
                font-weight: 600;
                color: #333333;
            }
        }

        .account-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 30rpx 0;
            border-bottom: 1rpx solid #E5E5E5;

            &:last-child {
                border-bottom: none;
            }

            .account-item-left {
                flex: 1;
                align-items: center;

                .account-icon {
                    width: 80rpx;
                    height: 80rpx;
                    margin-right: 20rpx;
                }

                .account-info {
                    display: flex;
                    flex-direction: column;

                    .account-name {
                        font-size: 32rpx;
                        color: #333333;
                        margin-bottom: 10rpx;
                    }

                    .account-hint {
                        font-size: 24rpx;
                        color: #999999;
                    }
                }
            }
        }
    }

    .withdraw-form {
        padding: 0 36rpx 20rpx;
        border-radius: 20rpx;
    }

    .upload-image {
        width: 142rpx;
        height: 142rpx;
        border: 2rpx dashed #cccccc;
        border-radius: 5px;
    }

    .withdraw-submit {
        background: linear-gradient(91.58deg, #49AB02 15.84%, #E4E872 83.36%, #EFFD6B 96.79%);
        border-radius: 50rpx;
        font-size: 32rpx;
        font-weight: 600;
    }

    ::v-deep .u-field {
        padding: 26rpx 0;
    }
}
</style>
