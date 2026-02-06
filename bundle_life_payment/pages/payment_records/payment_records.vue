<template>
  <view class="payment-records-page">
    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <view class="records-list" v-if="recordsList.length > 0">
        <view 
          class="record-item"
          v-for="(item, index) in recordsList"
          :key="index"
          @click="viewRecordDetail(item)"
        >
          <view class="record-header">
            <view class="record-type">
              <view class="type-icon" :style="{ backgroundColor: getTypeColor(item.type).bg }">
                <u-icon :name="getTypeColor(item.type).icon" size="24" :color="getTypeColor(item.type).color"></u-icon>
              </view>
              <view class="type-info">
                <text class="type-name">{{ getTypeName(item.type) }}</text>
                <text class="record-time">{{ item.payment_time }}</text>
              </view>
            </view>
            <view class="record-status" :class="{
              'status-pending': item.status === 0,
              'status-success': item.status === 1,
              'status-refund': item.status === 2,
              'status-failed': item.status === 3
            }">
              {{ getStatusText(item.status) }}
            </view>
          </view>
          
          <view class="record-content">
            <view class="content-row">
              <text class="content-label">缴费单位：</text>
              <text class="content-value">{{ item.payment_unit }}</text>
            </view>
            <view class="content-row" v-if="item.account_number">
              <text class="content-label">户号：</text>
              <text class="content-value">{{ item.account_number }}</text>
            </view>
            <view class="content-row" v-if="item.phone_number">
              <text class="content-label">手机号：</text>
              <text class="content-value">{{ item.phone_number }}</text>
            </view>
            <view class="content-row">
              <text class="content-label">缴费金额：</text>
              <text class="content-amount">¥{{ item.amount }}</text>
            </view>
            <view class="content-row" v-if="item.order_sn">
              <text class="content-label">订单号：</text>
              <text class="content-value">{{ item.order_sn }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-state" v-else>
        <u-empty mode="data" text="暂无缴费记录"></u-empty>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      recordsList: [
        {
          id: 1,
          type: 'electricity',
          payment_unit: '国网冀北电力有限公司',
          account_number: '1601234567890',
          amount: '150.00',
          payment_time: '2026-02-05 14:30:25',
          status: 1,
          order_sn: 'LP20260205143025001',
          city: '廊坊市'
        },
        {
          id: 2,
          type: 'water',
          payment_unit: '霸州市新胜供水有限公司',
          account_number: '1609876543210',
          amount: '100.00',
          payment_time: '2026-02-04 10:15:30',
          status: 1,
          order_sn: 'LP20260204101530002',
          city: '廊坊市'
        },
        {
          id: 3,
          type: 'gas',
          payment_unit: '霸州市新胜燃气有限公司',
          account_number: '1605555555555',
          amount: '200.00',
          payment_time: '2026-02-03 16:45:10',
          status: 1,
          order_sn: 'LP20260203164510003',
          city: '廊坊市'
        },
        {
          id: 4,
          type: 'phone',
          phone_number: '13800138000',
          amount: '50.00',
          payment_time: '2026-02-02 09:20:15',
          status: 1,
          order_sn: 'LP20260202092015004'
        },
        {
          id: 5,
          type: 'electricity',
          payment_unit: '国网冀北电力有限公司',
          account_number: '1601234567890',
          amount: '300.00',
          payment_time: '2026-02-01 11:30:45',
          status: 0,
          order_sn: 'LP20260201113045005',
          city: '廊坊市'
        },
        {
          id: 6,
          type: 'phone',
          phone_number: '13900139000',
          amount: '100.00',
          payment_time: '2026-01-31 15:10:20',
          status: 1,
          order_sn: 'LP20260131151020006'
        }
      ]
    };
  },
  onLoad() {
    // TODO: 从服务器加载缴费记录
    // this.loadPaymentRecords();
  },
  methods: {
    getTypeName(type) {
      const typeMap = {
        electricity: '电费',
        water: '水费',
        gas: '燃气费',
        phone: '话费充值'
      };
      return typeMap[type] || '未知';
    },
    getTypeColor(type) {
      const colorMap = {
        electricity: {
          icon: 'bolt',
          color: '#FFC107',
          bg: '#FFF9E6'
        },
        water: {
          icon: 'info-circle',
          color: '#2196F3',
          bg: '#E3F2FD'
        },
        gas: {
          icon: 'star',
          color: '#F44336',
          bg: '#FFEBEE'
        },
        phone: {
          icon: 'phone',
          color: '#4CAF50',
          bg: '#E8F5E9'
        }
      };
      return colorMap[type] || { icon: 'grid', color: '#999999', bg: '#F5F5F5' };
    },
    getStatusText(status) {
      const statusMap = {
        0: '待支付',
        1: '已支付',
        2: '已退款',
        3: '支付失败'
      };
      return statusMap[status] || '未知';
    },
    viewRecordDetail(item) {
      uni.showToast({
        title: '查看详情',
        icon: 'none'
      });
      // TODO: 跳转到详情页面
      // uni.navigateTo({
      //   url: `/bundle_life_payment/pages/payment_record_detail/payment_record_detail?id=${item.id}`
      // });
    },
    async loadPaymentRecords() {
      // TODO: 调用接口加载缴费记录
      // try {
      //   const res = await getPaymentRecords();
      //   if (res.code === 1) {
      //     this.recordsList = res.data || [];
      //   }
      // } catch (error) {
      //   console.error('加载缴费记录失败:', error);
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
.payment-records-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #4CAF50 0%, #E8F5E9 50%, #F5F5F5 100%);
  display: flex;
  flex-direction: column;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20rpx;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.record-item {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.record-type {
  display: flex;
  align-items: center;
  gap: 15rpx;
  flex: 1;
}

.type-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
}

.type-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.record-time {
  font-size: 24rpx;
  color: #999999;
}

.record-status {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.status-pending {
  background: #FFF3E0;
  color: #FF9800;
}

.status-success {
  background: #E8F5E9;
  color: #4CAF50;
}

.status-refund {
  background: #FCE4EC;
  color: #E91E63;
}

.status-failed {
  background: #FFEBEE;
  color: #F44336;
}

.record-content {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.content-row {
  display: flex;
  align-items: center;
  font-size: 28rpx;
}

.content-label {
  color: #666666;
  min-width: 140rpx;
}

.content-value {
  color: #333333;
  flex: 1;
}

.content-amount {
  color: #F44336;
  font-size: 32rpx;
  font-weight: bold;
}

.empty-state {
  padding-top: 200rpx;
}
</style>

