<template>
  <view class="send-express-page">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部导航栏 -->
    <view class="header-navbar">
      <view class="navbar-content">
        <view class="back-btn" @click="goBack">
          <u-icon name="arrow-left" size="20" color="#FFFFFF"></u-icon>
        </view>
        <view class="navbar-title">寄快递</view>
        <view class="navbar-right"></view>
      </view>
    </view>

    <!-- Banner图 -->
    <view class="banner-section">
      <image src="/static/images/banner_express.jpg" mode="aspectFill" class="banner-img"></image>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <view class="content-container">
        <!-- 标题区域 -->
        <view class="title-section">
          <text class="main-title">寄快递</text>
          <text class="sub-link" @click="goToMyShipments">我的邮寄</text>
        </view>

        <!-- 寄件人信息 -->
        <view class="info-section" @click="selectSenderAddress">
          <view class="info-left">
            <view class="icon-box sender-icon">
              <text class="icon-text">寄</text>
            </view>
            <view class="info-content">
              <text class="info-text" v-if="!senderAddress.contact">点击填写寄件地址,支持文本导入</text>
              <view v-else class="address-info">
                <text class="contact-info">{{ senderAddress.contact }} {{ senderAddress.telephone }}</text>
                <text class="address-text">
                  {{ senderAddress.province }} {{ senderAddress.city }} {{ senderAddress.district }} {{ senderAddress.address }}
                </text>
              </view>
            </view>
          </view>
          <view class="info-right">
            <text class="link-text">地址簿</text>
            <u-icon name="arrow-right" size="16" color="#999999"></u-icon>
          </view>
        </view>

        <!-- 收件人信息 -->
        <view class="info-section" @click="selectReceiverAddress">
          <view class="info-left">
            <view class="icon-box receiver-icon">
              <text class="icon-text">收</text>
            </view>
            <view class="info-content">
              <text class="info-text" v-if="!receiverAddress.contact">复制收件人信息,系统自动填写</text>
              <view v-else class="address-info">
                <text class="contact-info">{{ receiverAddress.contact }} {{ receiverAddress.telephone }}</text>
                <text class="address-text">
                  {{ receiverAddress.province }} {{ receiverAddress.city }} {{ receiverAddress.district }} {{ receiverAddress.address }}
                </text>
              </view>
            </view>
          </view>
          <view class="info-right">
            <text class="link-text">地址簿</text>
            <u-icon name="arrow-right" size="16" color="#999999"></u-icon>
          </view>
        </view>

        <!-- 快捷操作 -->
        <view class="quick-actions" v-if="!receiverAddress.contact">
          <text class="action-link" @click="pasteAddress">粘贴地址</text>
          <text class="action-link" @click="recognizeImage">图片识别</text>
          <text class="action-link" @click="addMoreReceivers">更多收件人</text>
        </view>

        <!-- 物品信息 -->
        <view class="info-section" @click="showItemInfo">
          <view class="section-title">物品信息</view>
          <view class="section-right">
            <text class="section-text">{{ itemInfo.name || '请选择物品信息' }}</text>
            <u-icon name="arrow-right" size="16" color="#999999"></u-icon>
          </view>
        </view>

        <!-- 上门取件 -->
        <view class="pickup-section">
          <view class="section-header">
            <text class="section-title">上门取件</text>
            <text class="section-link" @click="viewMoreCompanies">查看更多快递公司</text>
          </view>
          <scroll-view class="company-scroll" scroll-x>
            <view class="company-list">
              <view 
                v-for="(company, index) in companyList" 
                :key="index"
                class="company-item"
                :class="{ active: selectedCompanyIndex === index }"
                @click="selectCompany(index)"
              >
                <view class="company-name">{{ company.name }}</view>
                <view class="company-price">¥{{ company.price }}</view>
                <view class="company-weight">续重¥{{ company.additionalWeight }}/kg</view>
                <view class="company-time">{{ company.deliveryTime }}</view>
                <view class="check-icon" v-if="selectedCompanyIndex === index">
                  <u-icon name="checkmark" size="20" color="#4CAF50"></u-icon>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 期望上门时间 -->
        <view class="info-section" @click="selectPickupTime">
          <view class="section-title">期望上门时间</view>
          <view class="section-right">
            <text class="section-text">{{ pickupTime || '今天18:00-19:00' }}</text>
            <u-icon name="arrow-right" size="16" color="#999999"></u-icon>
          </view>
        </view>

        <!-- 保价服务 -->
        <view class="insurance-section">
          <view class="insurance-banner">
            <u-icon name="shield" size="20" color="#FF9800"></u-icon>
            <text class="insurance-title">保价服务</text>
          </view>
          <view class="insurance-tip">物品价值超过200元建议保价</view>
          <u-radio-group v-model="insuranceType" active-color="#4CAF50">
            <view 
              class="insurance-option"
              :class="{ active: insuranceType == '0' }"
              @click="changeInsurance('0')"
            >
              <u-radio name="0" shape="circle"></u-radio>
              <text class="option-text">不保价</text>
              <text class="option-desc">最高赔付6倍运费</text>
            </view>
            <view 
              class="insurance-option"
              :class="{ active: insuranceType == '1' }"
              @click="changeInsurance('1')"
            >
              <u-radio name="1" shape="circle"></u-radio>
              <text class="option-text">最高赔付1000元</text>
            </view>
            <view 
              class="insurance-option"
              :class="{ active: insuranceType == '2' }"
              @click="changeInsurance('2')"
            >
              <u-radio name="2" shape="circle"></u-radio>
              <text class="option-text">最高赔付2000元</text>
            </view>
            <view 
              class="insurance-option"
              :class="{ active: insuranceType == '3' }"
              @click="changeInsurance('3')"
            >
              <u-radio name="3" shape="circle"></u-radio>
              <text class="option-text">自定义物品价值</text>
              <text class="option-link" v-if="insuranceType == '3'" @click.stop="setCustomValue">去填写</text>
            </view>
          </u-radio-group>
        </view>
      </view>
    </scroll-view>

    <!-- 底部支付栏 -->
    <view class="footer-bar">
      <view class="footer-left">
        <text class="price-text">预计: {{ estimatedPrice || '--' }}元</text>
        <text class="detail-link" @click="showPriceDetail">明细</text>
      </view>
      <view class="footer-right">
        <u-checkbox v-model="agreeProtocol" shape="circle"></u-checkbox>
        <text class="protocol-text">阅读并同意《快递100寄件服务协议》</text>
      </view>
      <button class="pay-btn" :disabled="!canPay" @click="payNow">立即缴费</button>
    </view>

    <!-- 物品信息弹窗 -->
    <item-info-popup 
      ref="itemInfoPopup"
      :item-info="itemInfo"
      @confirm="onItemInfoConfirm"
    />

    <!-- 时间选择器 -->
    <u-picker
      :show="showTimePicker"
      :columns="timeColumns"
      @confirm="onTimeConfirm"
      @cancel="showTimePicker = false"
    ></u-picker>
  </view>
</template>

<script>
import ItemInfoPopup from './components/item_info_popup.vue';
import { createExpressOrder } from '@/api/store';

export default {
  components: {
    ItemInfoPopup
  },
  data() {
    return {
      statusBarHeight: 0,
      senderAddress: {},
      receiverAddress: {},
      itemInfo: {
        name: '',
        weight: 1,
        volume: '',
        remarks: ''
      },
      selectedCompanyIndex: 0,
      companyList: [
        { name: '圆通', price: '5.00', additionalWeight: '2', deliveryTime: '预计后天送达' },
        { name: '圆通', price: '5.50', additionalWeight: '2', deliveryTime: '预计明天送达' },
        { name: '圆通', price: '6.00', additionalWeight: '2', deliveryTime: '预计今天送达' }
      ],
      pickupTime: '',
      insuranceType: '0',
      customInsuranceValue: '',
      estimatedPrice: '',
      agreeProtocol: false,
      showTimePicker: false,
      timeColumns: [
        ['今天', '明天', '后天'],
        ['18:00-19:00', '19:00-20:00', '20:00-21:00']
      ]
    };
  },
  computed: {
    canPay() {
      return this.senderAddress.contact && 
             this.receiverAddress.contact && 
             this.itemInfo.name && 
             this.agreeProtocol;
    }
  },
  onLoad() {
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 0;
    // 初始化计算价格
    this.calculatePrice();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    goToMyShipments() {
      // 跳转到我的邮寄页面
      uni.navigateTo({
        url: '/bundle_express/pages/my_shipments/my_shipments'
      });
    },
    selectSenderAddress() {
      uni.navigateTo({
        url: '/bundle_express/pages/sender_address_list/sender_address_list?type=sender'
      });
    },
    selectReceiverAddress() {
      uni.navigateTo({
        url: '/bundle_express/pages/receiver_address_list/receiver_address_list?type=receiver'
      });
    },
    pasteAddress() {
      // 粘贴地址功能
      uni.getClipboardData({
        success: (res) => {
          // 解析粘贴的地址信息
          console.log('粘贴的地址:', res.data);
        }
      });
    },
    recognizeImage() {
      // 图片识别地址功能
      uni.chooseImage({
        count: 1,
        success: (res) => {
          // 调用OCR识别接口
          console.log('选择的图片:', res.tempFilePaths);
        }
      });
    },
    addMoreReceivers() {
      // 添加更多收件人
      console.log('添加更多收件人');
    },
    showItemInfo() {
      if (this.$refs.itemInfoPopup) {
        this.$refs.itemInfoPopup.showPopup();
      }
    },
    onItemInfoConfirm(itemInfo) {
      this.itemInfo = itemInfo;
      this.calculatePrice();
    },
    selectCompany(index) {
      this.selectedCompanyIndex = index;
      this.calculatePrice();
    },
    selectPickupTime() {
      this.showTimePicker = true;
    },
    onTimeConfirm(e) {
      const selectedDate = e.value[0];
      const selectedTime = e.value[1];
      this.pickupTime = `${selectedDate} ${selectedTime}`;
      this.showTimePicker = false;
    },
    changeInsurance(value) {
      this.insuranceType = value;
    },
    setCustomValue() {
      uni.showModal({
        title: '自定义物品价值',
        editable: true,
        placeholderText: '请输入物品价值（元）',
        success: (res) => {
          if (res.confirm && res.content) {
            this.customInsuranceValue = res.content;
          }
        }
      });
    },
    viewMoreCompanies() {
      // 查看更多快递公司
      console.log('查看更多快递公司');
    },
    showPriceDetail() {
      // 显示价格明细
      uni.showModal({
        title: '价格明细',
        content: `基础运费: ¥${this.companyList[this.selectedCompanyIndex].price}\n续重费用: ¥${this.companyList[this.selectedCompanyIndex].additionalWeight}/kg`,
        showCancel: false
      });
    },
    calculatePrice() {
      // 计算预计价格
      const basePrice = parseFloat(this.companyList[this.selectedCompanyIndex].price);
      const weight = this.itemInfo.weight || 1;
      const additionalWeight = Math.max(0, weight - 1);
      const additionalPrice = additionalWeight * parseFloat(this.companyList[this.selectedCompanyIndex].additionalWeight);
      this.estimatedPrice = (basePrice + additionalPrice).toFixed(2);
    },
    payNow() {
      if (!this.canPay) {
        uni.showToast({
          title: '请完善必填信息',
          icon: 'none'
        });
        return;
      }
      
      // 弹出确认对话框
      uni.showModal({
        title: '确认创建订单',
        content: '确认创建快递订单并支付吗？',
        confirmText: '确认',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.createOrder();
          }
        }
      });
    },
    async createOrder() {
      // 创建订单
      uni.showLoading({
        title: '创建订单中...'
      });
      
      try {
        const selectedCompany = this.companyList[this.selectedCompanyIndex];
        const orderData = {
          sender_address_id: this.senderAddress.id,
          receiver_address_id: this.receiverAddress.id,
          item_name: this.itemInfo.name,
          item_weight: this.itemInfo.weight,
          item_volume: this.itemInfo.volume,
          item_remarks: this.itemInfo.remarks,
          company_name: selectedCompany.name,
          base_price: selectedCompany.price,
          additional_price: selectedCompany.additionalWeight,
          pickup_time: this.pickupTime,
          insurance_type: parseInt(this.insuranceType),
          insurance_value: this.customInsuranceValue || 0,
          insurance_fee: parseInt(this.insuranceType) > 0 ? (this.insuranceType === '3' ? parseFloat(this.customInsuranceValue) * 0.01 : (this.insuranceType === '1' ? 5 : 10)) : 0
        };
        
        const res = await createExpressOrder(orderData);
        
        uni.hideLoading();
        
        if (res.code === 1) {
          // 跳转到支付页面
          uni.navigateTo({
            url: `/pages/payment/payment?from=order&order_id=${res.data.order_id}&amount=${res.data.total_amount}`
          });
        } else {
          uni.showToast({
            title: res.msg || '创建订单失败',
            icon: 'none'
          });
        }
      } catch (error) {
        uni.hideLoading();
        console.error('创建订单失败:', error);
        uni.showToast({
          title: '创建订单失败，请重试',
          icon: 'none'
        });
      }
    }
  },
  onShow() {
    // 监听地址选择
    uni.$off('selectSenderAddress');
    uni.$off('selectReceiverAddress');
    
    uni.$on('selectSenderAddress', (data) => {
      this.senderAddress = data;
    });
    
    uni.$on('selectReceiverAddress', (data) => {
      this.receiverAddress = data;
    });
  },
  onUnload() {
    uni.$off('selectSenderAddress');
    uni.$off('selectReceiverAddress');
  }
};
</script>

<style lang="scss" scoped>
.send-express-page {
  width: 100%;
  min-height: 100vh;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
}

.status-bar {
  width: 100%;
  background-color: #4CAF50;
}

.header-navbar {
  width: 100%;
  background: linear-gradient(180deg, #4CAF50 0%, #45A049 100%);
  padding: 10rpx 0;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  height: 88rpx;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-size: 36rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.navbar-right {
  width: 60rpx;
}

.banner-section {
  width: 100%;
  height: 300rpx;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
  display: block;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
}

.content-container {
  padding: 30rpx;
  padding-bottom: 200rpx;
}

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.main-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333333;
}

.sub-link {
  font-size: 28rpx;
  color: #4CAF50;
}

.info-section {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.icon-box {
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.sender-icon {
  background-color: #333333;
}

.receiver-icon {
  background-color: #4CAF50;
}

.icon-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #FFFFFF;
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-text {
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 10rpx;
}

.address-info {
  display: flex;
  flex-direction: column;
}

.contact-info {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 8rpx;
}

.address-text {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.5;
}

.info-right {
  display: flex;
  align-items: center;
}

.link-text {
  font-size: 26rpx;
  color: #999999;
  margin-right: 10rpx;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  margin-bottom: 20rpx;
}

.action-link {
  font-size: 26rpx;
  color: #4CAF50;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.section-right {
  display: flex;
  align-items: center;
}

.section-text {
  font-size: 28rpx;
  color: #666666;
  margin-right: 10rpx;
}

.pickup-section {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-link {
  font-size: 26rpx;
  color: #4CAF50;
}

.company-scroll {
  white-space: nowrap;
}

.company-list {
  display: inline-flex;
}

.company-item {
  position: relative;
  min-width: 200rpx;
  padding: 20rpx;
  margin-right: 20rpx;
  border: 2rpx solid #E0E0E0;
  border-radius: 12rpx;
  background: #FFFFFF;
}

.company-item.active {
  border-color: #4CAF50;
  background: #F1F8F4;
}

.company-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10rpx;
}

.company-price {
  font-size: 32rpx;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 5rpx;
}

.company-weight {
  font-size: 24rpx;
  color: #999999;
  margin-bottom: 5rpx;
}

.company-time {
  font-size: 24rpx;
  color: #666666;
}

.check-icon {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
}

.insurance-section {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.insurance-banner {
  display: flex;
  align-items: center;
  background: #FFF3E0;
  padding: 20rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.insurance-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #FF9800;
  margin-left: 10rpx;
}

.insurance-tip {
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 20rpx;
}

.insurance-options {
  display: flex;
  flex-direction: column;
}

.insurance-option {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
}

.insurance-option:last-child {
  border-bottom: none;
}

.insurance-option.active {
  color: #4CAF50;
}

.option-text {
  font-size: 28rpx;
  margin-left: 10rpx;
  flex: 1;
}

.option-desc {
  font-size: 24rpx;
  color: #999999;
  margin-left: 10rpx;
}

.option-link {
  font-size: 26rpx;
  color: #4CAF50;
  margin-left: 10rpx;
}

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.footer-left {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.price-text {
  font-size: 28rpx;
  color: #333333;
  margin-right: 20rpx;
}

.detail-link {
  font-size: 26rpx;
  color: #4CAF50;
}

.footer-right {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.protocol-text {
  font-size: 24rpx;
  color: #666666;
  margin-left: 10rpx;
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

