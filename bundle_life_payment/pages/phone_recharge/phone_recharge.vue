<template>
  <view class="phone-recharge-page">
    <!-- 自定义导航栏 -->
    <custom-navbar title="话费充值" bgColor="#cbfac5" textColor="#333" iconColor="#333"></custom-navbar>

    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <view class="content-container">
        <!-- 手机号输入 -->
        <view class="phone-section">
          <text class="phone-label">请输入手机号码</text>
          <view class="phone-input-wrapper">
            <input 
              class="phone-input" 
              type="number"
              v-model="phoneNumber"
              placeholder="请输入手机号"
              maxlength="11"
            />
          </view>
          <text class="contact-link" @click="selectFromContacts">从通讯录选择></text>
        </view>

        <!-- 充值金额 -->
        <view class="amount-section">
          <text class="section-title">充话费</text>
          <view class="amount-input-wrapper">
            <text class="currency">¥</text>
            <input 
              class="amount-input" 
              type="digit"
              v-model="rechargeAmount"
              placeholder="点击输入缴费金额"
            />
          </view>
          <view class="preset-amounts">
            <view 
              class="preset-btn"
              v-for="(amount, index) in presetAmounts"
              :key="index"
              :class="{ active: rechargeAmount == amount }"
              @click="selectAmount(amount)"
            >
              {{ amount }}元
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部缴费按钮 -->
    <view class="footer-section">
      <button 
        class="pay-btn" 
        :disabled="!canPay"
        @click="payNow"
      >
        立即缴费
      </button>
    </view>
  </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
  components: {
    CustomNavbar
  },
  data() {
    return {
      phoneNumber: '',
      rechargeAmount: '',
      presetAmounts: ['30', '50', '100', '200', '300', '500']
    };
  },
  computed: {
    canPay() {
      return this.phoneNumber && 
             /^1[3-9]\d{9}$/.test(this.phoneNumber) && 
             this.rechargeAmount && 
             parseFloat(this.rechargeAmount) > 0;
    }
  },
  methods: {
    selectFromContacts() {
      // #ifdef APP-PLUS || MP-WEIXIN
      uni.choosePhoneNumber({
        success: (res) => {
          this.phoneNumber = res.phoneNumber;
        },
        fail: (err) => {
          console.log('选择联系人失败:', err);
          uni.showToast({
            title: '选择联系人失败',
            icon: 'none'
          });
        }
      });
      // #endif
      // #ifndef APP-PLUS || MP-WEIXIN
      uni.showToast({
        title: '暂不支持此功能',
        icon: 'none'
      });
      // #endif
    },
    selectAmount(amount) {
      this.rechargeAmount = amount;
    },
    payNow() {
      if (!this.canPay) {
        uni.showToast({
          title: '请完善必填信息',
          icon: 'none'
        });
        return;
      }
      
      uni.showModal({
        title: '确认充值',
        content: `确认为${this.phoneNumber}充值${this.rechargeAmount}元吗？`,
        success: (res) => {
          if (res.confirm) {
            this.submitRecharge();
          }
        }
      });
    },
    async submitRecharge() {
      uni.showLoading({
        title: '充值中...'
      });
      
      try {
        // TODO: 调用充值接口
        // const res = await createPhoneRecharge({
        //   phone_number: this.phoneNumber,
        //   amount: this.rechargeAmount
        // });
        
        // 模拟充值成功
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: '充值成功',
            icon: 'success'
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }, 2000);
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: '充值失败，请重试',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.phone-recharge-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #cbfac5 30%, #F5F5F5 45%);
  display: flex;
  flex-direction: column;
  padding-top: calc(128rpx + var(--status-bar-height));
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
}

.content-container {
  padding: 40rpx 30rpx;
}

.phone-section {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 30rpx;
}

.phone-label {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 30rpx;
}

.phone-input-wrapper {
  border-bottom: 1rpx solid #E0E0E0;
  padding-bottom: 20rpx;
  margin-bottom: 20rpx;
}

.phone-input {
  width: 100%;
  font-size: 32rpx;
  color: #333333;
}

.contact-link {
  font-size: 26rpx;
  color: #999999;
}

.amount-section {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
}

.section-title {
  display: block;
  font-size: 28rpx;
  color: #999999;
  margin-bottom: 30rpx;
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #E0E0E0;
  margin-bottom: 30rpx;
}

.currency {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-right: 10rpx;
}

.amount-input {
  flex: 1;
  font-size: 32rpx;
  color: #333333;
}

.preset-amounts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.preset-btn {
  height: 80rpx;
  background: #E8F5E9;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #4CAF50;
  border: 2rpx solid transparent;
}

.preset-btn.active {
  background: #4CAF50;
  color: #FFFFFF;
  border-color: #4CAF50;
}

.footer-section {
  padding: 30rpx;
  background: #FFFFFF;
  border-top: 1rpx solid #F0F0F0;
}

.pay-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%);
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 44rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-btn:disabled {
  background: #CCCCCC;
  color: #FFFFFF;
}
</style>

