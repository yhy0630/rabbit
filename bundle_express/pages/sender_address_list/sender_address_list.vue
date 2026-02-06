<template>
  <view class="address-list-page">
    <view class="no-address" v-if="!hasAddress">
      <image class="img-null" src="/static/images/address_null.png"></image>
      <view class="empty-text">暂无寄件地址，请添加~</view>
    </view>
    
    <view class="address-list" v-else>
      <view 
        v-for="(item, index) in addressList" 
        :key="index" 
        class="address-item"
        @click="selectAddress(item)"
      >
        <view class="address-content">
          <view class="address-header">
            <text class="contact-name">{{ item.contact }}</text>
            <text class="contact-phone">{{ item.telephone }}</text>
          </view>
          <view class="address-detail">
            {{ item.province }} {{ item.city }} {{ item.district }} {{ item.address }}
          </view>
        </view>
        <view class="address-actions" @click.stop>
          <view class="action-item" @click="setDefault(item.id)" v-if="item.is_default != 1">
            <text class="action-text">设为默认</text>
          </view>
          <view class="action-item default" v-else>
            <text class="action-text">默认</text>
          </view>
          <view class="action-item" @click="editAddress(item.id)">
            <image class="action-icon" src="/static/images/icon_edit.png"></image>
            <text class="action-text">编辑</text>
          </view>
          <view class="action-item" @click="deleteAddress(item.id)">
            <image class="action-icon" src="/static/images/icon_del_1.png"></image>
            <text class="action-text">删除</text>
          </view>
        </view>
      </view>
    </view>

    <view class="footer-bar">
      <button class="add-btn" @click="addAddress">新增寄件地址</button>
    </view>
  </view>
</template>

<script>
import { getAddressLists, delAddress, setDefaultAddress } from '@/api/user';

export default {
  data() {
    return {
      addressList: [],
      hasAddress: false,
      addressType: 'sender' // sender 或 receiver
    };
  },
  onLoad(options) {
    this.addressType = options.type || 'sender';
    uni.setNavigationBarTitle({
      title: this.addressType === 'sender' ? '寄件地址' : '收件地址'
    });
  },
  onShow() {
    this.getAddressList();
  },
  methods: {
    getAddressList() {
      getAddressLists().then(res => {
        if (res.code == 1) {
          if (res.data && res.data.length > 0) {
            this.addressList = res.data;
            this.hasAddress = true;
          } else {
            this.hasAddress = false;
          }
        } else {
          this.hasAddress = false;
        }
      });
    },
    selectAddress(item) {
      // 发送地址选择事件
      uni.$emit('selectSenderAddress', item);
      uni.navigateBack();
    },
    setDefault(id) {
      setDefaultAddress(id).then(res => {
        if (res.code == 1) {
          uni.showToast({
            title: res.msg || '设置成功',
            icon: 'success'
          });
          this.getAddressList();
        }
      });
    },
    editAddress(id) {
      uni.navigateTo({
        url: `/bundle_express/pages/express_address_edit/express_address_edit?id=${id}&type=${this.addressType}`
      });
    },
    deleteAddress(id) {
      uni.showModal({
        title: '提示',
        content: '确认删除该地址吗？',
        success: (res) => {
          if (res.confirm) {
            delAddress(id).then(result => {
              if (result.code == 1) {
                uni.showToast({
                  title: result.msg || '删除成功',
                  icon: 'success'
                });
                this.getAddressList();
              }
            });
          }
        }
      });
    },
    addAddress() {
      uni.navigateTo({
        url: `/bundle_express/pages/express_address_edit/express_address_edit?type=${this.addressType}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.address-list-page {
  min-height: 100vh;
  background-color: #F5F5F5;
  padding-bottom: 120rpx;
}

.no-address {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.img-null {
  width: 300rpx;
  height: 300rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
}

.address-list {
  padding: 20rpx;
}

.address-item {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.address-content {
  margin-bottom: 20rpx;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.contact-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-right: 20rpx;
}

.contact-phone {
  font-size: 28rpx;
  color: #666666;
}

.address-detail {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
}

.address-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 30rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #F0F0F0;
}

.action-item {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #666666;
}

.action-item.default {
  color: #4CAF50;
}

.action-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 8rpx;
}

.action-text {
  font-size: 26rpx;
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
}

.add-btn {
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
</style>

