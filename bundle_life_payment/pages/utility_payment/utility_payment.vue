<template>
  <view class="utility-payment-page">
    <!-- 自定义导航栏 -->
    <custom-navbar :title="typeConfig.name" bgColor="#cbfac5" textColor="#333" iconColor="#333"></custom-navbar>

    
    <!-- 顶部类型栏 -->
    <view class="type-header">
      <view class="type-icon">
        <image :src="typeConfig.iconImage" mode="aspectFit" class="type-icon-img"></image>
      </view>
      <text class="type-name">{{ typeConfig.name }}</text>
      <view class="city-selector" @click="selectCity">
        <text class="city-name">{{ selectedCity }}</text>
        <u-icon name="arrow-down" size="16" color="#FFFFFF"></u-icon>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <!-- 缴费单位和户号 -->
      <view class="form-section">
        <!-- 缴费单位 -->
        <view class="unit-section" @click="selectPaymentUnit">
          <view class="section-label">缴费单位</view>
          <view class="section-value">
            <text class="value-text">{{ paymentUnit || '请选择缴费单位' }}</text>
            <u-icon name="arrow-right" size="16" color="#999999"></u-icon>
          </view>
        </view>
        
        <!-- 分隔线 -->
        <view class="divider"></view>
        
        <!-- 户号 -->
        <view class="account-section">
          <view class="section-label">户号</view>
          <view class="input-wrapper">
            <input 
              class="account-input" 
              type="number"
              v-model="accountNumber"
              placeholder="请输入13位户号"
              maxlength="13"
            />
            <text class="help-link" @click.stop="viewHelp">查看获取方式</text>
          </view>
          <view class="quick-get" @click="quickGetAccount">
            <view class="quick-icon">
              <u-icon name="grid" size="20" color="#4CAF50"></u-icon>
            </view>
            <text class="quick-text">快速获取网上国网户号</text>
            <u-icon name="arrow-right" size="16" color="#4CAF50"></u-icon>
          </view>
          <view class="account-tip">
            户号已升级至13位(160+原户号,若为13位165新户号则直接输入户号)
          </view>
        </view>
      </view>

      <!-- 余额 -->
      <view class="form-section">
        <view class="balance-header">
          <text class="section-label">余额</text>
          <text class="view-link" @click="viewBalance">查看</text>
        </view>
        <view class="amount-input-wrapper">
          <text class="currency">¥</text>
          <input 
            class="amount-input" 
            type="digit"
            v-model="paymentAmount"
            placeholder="点击输入缴费金额"
          />
        </view>
        <view class="preset-amounts">
          <view 
            class="preset-btn"
            v-for="(amount, index) in presetAmounts"
            :key="index"
            :class="{ active: paymentAmount == amount }"
            @click="selectAmount(amount)"
          >
            {{ amount }}元
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部协议和缴费按钮 -->
    <view class="footer-section">
      <view class="agreement-section">
        <u-checkbox v-model="agreeProtocol" shape="circle"></u-checkbox>
        <text class="agreement-text">同意《生活缴费协议》</text>
      </view>
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
      type: 'electricity', // electricity, water, gas
      typeConfig: {
        name: '电费',
        icon: 'flash',
        iconColor: '#FFC107',
        headerColor: '#FFC107',
        iconImage: '/static/images/dianfei.png'
      },
      selectedCity: '廊坊市',
      paymentUnit: '',
      accountNumber: '',
      paymentAmount: '',
      presetAmounts: ['50', '100', '150'],
      agreeProtocol: false,
      typeConfigs: {
        electricity: {
          name: '电费',
          icon: 'bolt',
          iconColor: '#FFC107',
          headerColor: '#FFC107',
          iconImage: '/static/images/dianfei.png',
          defaultUnit: '国网冀北电力有限公司'
        },
        water: {
          name: '水费',
          icon: 'info-circle',
          iconColor: '#2196F3',
          headerColor: '#2196F3',
          iconImage: '/static/images/shuifei.png',
          defaultUnit: '霸州市新胜供水有限公司'
        },
        gas: {
          name: '燃气费',
          icon: 'star',
          iconColor: '#F44336',
          headerColor: '#F44336',
          iconImage: '/static/images/ranqi-2 1.png',
          defaultUnit: '霸州市新胜燃气有限公司'
        }
      }
    };
  },
  computed: {
    canPay() {
      return this.paymentUnit && 
             this.accountNumber && 
             this.accountNumber.length === 13 && 
             this.paymentAmount && 
             parseFloat(this.paymentAmount) > 0 && 
             this.agreeProtocol;
    }
  },
  onLoad(options) {
    if (options && options.type) {
      this.type = options.type;
    } else {
      this.type = 'electricity';
    }
    this.typeConfig = this.typeConfigs[this.type] || this.typeConfigs.electricity;
    this.paymentUnit = this.typeConfig.defaultUnit;
  },
  methods: {
    selectCity() {
      uni.showToast({
        title: '选择城市',
        icon: 'none'
      });
    },
    selectPaymentUnit() {
      uni.showToast({
        title: '选择缴费单位',
        icon: 'none'
      });
    },
    viewHelp() {
      uni.showToast({
        title: '查看获取方式',
        icon: 'none'
      });
    },
    quickGetAccount() {
      uni.showToast({
        title: '快速获取户号',
        icon: 'none'
      });
    },
    viewBalance() {
      uni.showToast({
        title: '查看余额',
        icon: 'none'
      });
    },
    selectAmount(amount) {
      this.paymentAmount = amount;
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
        title: '确认缴费',
        content: `确认缴纳${this.typeConfig.name}${this.paymentAmount}元吗？`,
        success: (res) => {
          if (res.confirm) {
            this.submitPayment();
          }
        }
      });
    },
    async submitPayment() {
      uni.showLoading({
        title: '缴费中...'
      });
      
      try {
        // TODO: 调用缴费接口
        // const res = await createUtilityPayment({
        //   type: this.type,
        //   payment_unit: this.paymentUnit,
        //   account_number: this.accountNumber,
        //   amount: this.paymentAmount,
        //   city: this.selectedCity
        // });
        
        // 模拟缴费成功
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: '缴费成功',
            icon: 'success'
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }, 2000);
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: '缴费失败，请重试',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.utility-payment-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #cbfac5 30%, #F5F5F5 45%);
  display: flex;
  flex-direction: column;
  padding-top: calc(128rpx + var(--status-bar-height));
}

.type-header {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx 30rpx;
  gap: 20rpx;
  margin: 20rpx;
  margin-top: 10rpx;
  background: linear-gradient(90deg, #36AF29 0%, #ECF93B 100%);
  border-radius: 30rpx;
}

.type-icon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border-radius: 50%;
  flex-shrink: 0;
}

.type-icon-img {
  width: 40rpx;
  height: 40rpx;
}

.type-name {
  flex: 1;
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.city-selector {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 10rpx 20rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
}

.city-name {
  font-size: 28rpx;
  color: #FFFFFF;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20rpx;
  box-sizing: border-box;
}

.form-section {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  margin-top: -20rpx;
}

.unit-section {
  padding-bottom: 30rpx;
}

.account-section {
  padding-top: 30rpx;
}

.divider {
  height: 1rpx;
  background: #E0E0E0;
  margin: 0 -30rpx;
}

.section-label {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 20rpx;
}

.section-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.value-text {
  flex: 1;
  font-size: 28rpx;
  color: #666666;
}

.input-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.account-input {
  flex: 1;
  height: 80rpx;
  background: #F5F5F5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.help-link {
  font-size: 26rpx;
  color: #4CAF50;
  margin-left: 20rpx;
}

.quick-get {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 20rpx;
  background: #E8F5E9;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.quick-icon {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-text {
  flex: 1;
  font-size: 26rpx;
  color: #4CAF50;
}

.account-tip {
  font-size: 24rpx;
  color: #999999;
  line-height: 1.6;
}

.balance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.view-link {
  font-size: 26rpx;
  color: #4CAF50;
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #E0E0E0;
  margin-bottom: 20rpx;
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
  display: flex;
  gap: 20rpx;
}

.preset-btn {
  flex: 1;
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

.agreement-section {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.agreement-text {
  font-size: 26rpx;
  color: #666666;
}

.pay-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(90deg, #4CAF50 0%, #45A049 100%);
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

