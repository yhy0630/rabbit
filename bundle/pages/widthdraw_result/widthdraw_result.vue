

<template>
	<view class="widthdraw-result">
		<view class="contain bg-white">
			<view class="header flex-col col-center">
				<view>
					<image class="tips-icon" :src="getTipsIcon(widthdrawInfo.status)"></image>
				</view>
				<view class="xl m-t-20 bold">{{widthdrawInfo.statusDesc}}</view>
				<view class="flex-col col-center">
				  <price-format :price="widthdrawInfo.money" :color="colorConfig.primary"  subscript-size="30" first-size="46" second-size="46" weight="bold" />
				</view>
			</view>
			<view class="info">
				<view class="flex row-between m-t-20">
					<view>流水号</view>
					<view>
						{{widthdrawInfo.sn}}
					</view>
				</view>
				<view class="flex row-between m-t-20">
					<view>提交时间</view>
					<view>{{widthdrawInfo.create_time}}</view>
				</view>
				<view class="flex row-between m-t-20">
					<view>提现至</view>
					<view>{{widthdrawInfo.typeDesc}}</view>
				</view>
				<view class="flex row-between m-t-20">
					<view>服务费</view>
					<view>
						<price-format :price="widthdrawInfo.poundage"></price-format>
					</view>
				</view>
				<view class="flex row-between m-t-20">
					<view>实际到账</view>
					<view>
						<price-format :price="widthdrawInfo.left_money"></price-format>
					</view>
				</view>
				
			</view>
			<view class="line m-t-40" v-if="!type"></view>
			<view class="m-t-40 flex-col row-center" v-if="!type">
				<router-link to="/bundle/pages/user_withdraw_code/user_withdraw_code">
					<button type="primary" size="lg" class="br60">查看历史提现记录</button>
				</router-link>
				<router-link  navType="pushTab" to="/pages/index/index">
					<button size="lg" class="br60 plain primary m-t-30">返回首页</button>
				</router-link>
			</view>
		</view>
		<view class="muted m-t-20 xs text-center" v-if="widthdrawInfo.type != 2" >* 审核通过后约72小时内到账，请留意账户明细</view>
		<view class="btn"  @click="handleclick" v-if="widthdrawInfo.wechat_change_wait_receive"
            >立即收款</view
        >
		</view>
	</view>
</template>

<script>
import { getWithdrawDetail,withdrawReceive } from '@/api/user';
import wechath5 from '@/utils/wechath5'

export default {

  data() {
    return {
      widthdrawInfo: {},
	  type: ''

    };
  },

  onLoad () {
    this.id = this.$Route.query.id
	this.type = this.$Route.query.type
    this.getWithdrawDetailFun();
  },

 
  methods: {
	async handleclick() {
            // #ifdef MP-WEIXIN

            if (wx.canIUse('requestMerchantTransfer')) {
                wx.requestMerchantTransfer({
                    mchId: this.widthdrawInfo.pay_config.mch_id,
                    appId: wx.getAccountInfoSync().miniProgram.appId,
                    package: this.widthdrawInfo.pay_desc.package_info,
                    success: (res) => {
                        // res.err_msg将在页面展示成功后返回应用时返回ok，并不代表付款成功
                        console.log('success:', res)
                        withdrawReceive({ id: this.id }).then((res) => {
                            this.getWithdrawDetailFun()
                        })
                    },
                    fail: (res) => {
                        console.log('fail:', res)
                    }
                })
            } else {
                wx.showModal({
                    content: '你的微信版本过低，请更新至最新版本。',
                    showCancel: false
                })
            }

            // #endif
            // #ifdef H5
            var ua = navigator.userAgent.toLowerCase()
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                //这是微信环境
                try {
                    await wechath5.reviceTransfer(
                        this.widthdrawInfo.pay_config.mch_id,
                        this.widthdrawInfo.pay_config.oa_appid,
                        this.widthdrawInfo.pay_desc.package_info
                    )
                    withdrawReceive({ id: this.id }).then((res) => {
                        this.getWithdrawDetailFun()
                    })
                } catch (error) {
                    console.log(error)
                }
            } else {
                //这是非微信环境
                return this.$toast({
                    title: '请在微信环境内打开'
                })
            }
            // #endif
        },
    getWithdrawDetailFun() {
      getWithdrawDetail({
        id: this.id
      }).then(res => {
        if (res.code == 1) {
          this.widthdrawInfo = res.data
        }
      });
    },
	getTipsIcon(status) {
		// status 状态：1-待提现2-提现中3-提现成功4-提现失败
		switch(status) {
			case 1:
			case 2: return '/static/images/icon_wait.png'
			case 3: return '/static/images/icon_success.png'
			case 4: return '/static/images/icon_fail.png'
		}
	}

  }
};
</script>
<style lang="scss">
	.widthdraw-result {
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
		}
	}
	.btn {
    height: 80rpx;
    margin: 50rpx 20rpx 0 20rpx;
    background-color: #ff2c3c;
    color: white;
    line-height: 80rpx;
    text-align: center;
    border-radius: 20rpx;
}
</style>
