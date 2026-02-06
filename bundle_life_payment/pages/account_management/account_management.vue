<template>
  <view class="account-management-page">
    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <view class="account-list" v-if="accountList.length > 0">
        <view 
          class="account-item"
          v-for="(item, index) in accountList"
          :key="index"
          @click="selectAccount(item)"
        >
          <view class="account-header">
            <view class="account-type">
              <view class="type-icon" :style="{ backgroundColor: getTypeColor(item.type).bg }">
                <u-icon :name="getTypeColor(item.type).icon" size="24" :color="getTypeColor(item.type).color"></u-icon>
              </view>
              <text class="type-name">{{ getTypeName(item.type) }}</text>
            </view>
            <view class="account-actions">
              <view class="action-btn" @click.stop="editAccount(item, index)">
                <u-icon name="edit-pen" size="20" color="#4CAF50"></u-icon>
                <text class="action-text">编辑</text>
              </view>
              <view class="action-btn" @click.stop="deleteAccount(index)">
                <u-icon name="trash" size="20" color="#F44336"></u-icon>
                <text class="action-text">删除</text>
              </view>
            </view>
          </view>
          <view class="account-info">
            <view class="info-row">
              <text class="info-label">缴费单位：</text>
              <text class="info-value">{{ item.payment_unit }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">户号：</text>
              <text class="info-value">{{ item.account_number }}</text>
            </view>
            <view class="info-row" v-if="item.city">
              <text class="info-label">城市：</text>
              <text class="info-value">{{ item.city }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-state" v-else>
        <u-empty mode="data" text="暂无户号，请添加"></u-empty>
      </view>
    </scroll-view>

    <!-- 底部添加按钮 -->
    <view class="footer-section">
      <button class="add-btn" @click="addAccount">
        <u-icon name="plus" size="20" color="#FFFFFF"></u-icon>
        <text class="btn-text">新增缴费户号</text>
      </button>
    </view>

    <!-- 添加/编辑户号弹窗 -->
    <u-popup 
      v-model="showAccountDialog" 
      mode="bottom" 
      border-radius="20"
      height="70%"
    >
      <view class="account-dialog">
        <view class="dialog-header">
          <text class="dialog-title">{{ isEdit ? '编辑户号' : '新增户号' }}</text>
          <view class="close-btn" @click="showAccountDialog = false">
            <u-icon name="close" size="20" color="#666666"></u-icon>
          </view>
        </view>
        
        <scroll-view class="dialog-content" scroll-y>
          <view class="form-item">
            <text class="form-label">缴费类型<text class="required">*</text></text>
            <view class="form-value" @click="showTypePicker = true">
              <text :class="{ placeholder: !formData.type }">{{ formData.type ? getTypeName(formData.type) : '请选择缴费类型' }}</text>
              <u-icon name="arrow-right" size="16" color="#999999"></u-icon>
            </view>
          </view>
          
          <view class="form-item">
            <text class="form-label">城市<text class="required">*</text></text>
            <input 
              class="form-input" 
              v-model="formData.city"
              placeholder="请输入城市"
            />
          </view>
          
          <view class="form-item">
            <text class="form-label">缴费单位<text class="required">*</text></text>
            <input 
              class="form-input" 
              v-model="formData.payment_unit"
              placeholder="请输入缴费单位"
            />
          </view>
          
          <view class="form-item">
            <text class="form-label">户号<text class="required">*</text></text>
            <input 
              class="form-input" 
              type="number"
              v-model="formData.account_number"
              placeholder="请输入13位户号"
              maxlength="13"
            />
          </view>
          
          <view class="form-item">
            <text class="form-label">备注</text>
            <textarea 
              class="form-textarea" 
              v-model="formData.remark"
              placeholder="请输入备注（选填）"
              maxlength="100"
            ></textarea>
          </view>
        </scroll-view>
        
        <view class="dialog-footer">
          <button class="cancel-btn" @click="showAccountDialog = false">取消</button>
          <button class="confirm-btn" @click="saveAccount">确定</button>
        </view>
      </view>
    </u-popup>

    <!-- 类型选择器 -->
    <u-picker
      :show="showTypePicker"
      :columns="[typeOptions]"
      keyName="label"
      @confirm="onTypeConfirm"
      @cancel="showTypePicker = false"
    ></u-picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      accountList: [],
      showAccountDialog: false,
      isEdit: false,
      editIndex: -1,
      showTypePicker: false,
      formData: {
        type: '',
        city: '',
        payment_unit: '',
        account_number: '',
        remark: ''
      },
      typeOptions: [
        { label: '电费', value: 'electricity' },
        { label: '水费', value: 'water' },
        { label: '燃气费', value: 'gas' }
      ]
    };
  },
  onLoad() {
    this.loadAccounts();
  },
  methods: {
    loadAccounts() {
      // TODO: 从本地存储或服务器加载户号列表
      // const accounts = uni.getStorageSync('life_payment_accounts') || [];
      // this.accountList = accounts;
      
      // 模拟数据
      this.accountList = [
        {
          type: 'electricity',
          city: '廊坊市',
          payment_unit: '国网冀北电力有限公司',
          account_number: '1601234567890',
          remark: ''
        }
      ];
    },
    getTypeName(type) {
      const typeMap = {
        electricity: '电费',
        water: '水费',
        gas: '燃气费'
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
        }
      };
      return colorMap[type] || { icon: 'grid', color: '#999999', bg: '#F5F5F5' };
    },
    selectAccount(item) {
      // 选择户号后跳转到对应缴费页面
      uni.navigateTo({
        url: `/bundle_life_payment/pages/utility_payment/utility_payment?type=${item.type}&account_number=${item.account_number}&payment_unit=${encodeURIComponent(item.payment_unit)}&city=${encodeURIComponent(item.city)}`
      });
    },
    addAccount() {
      this.isEdit = false;
      this.editIndex = -1;
      this.formData = {
        type: '',
        city: '',
        payment_unit: '',
        account_number: '',
        remark: ''
      };
      this.showAccountDialog = true;
    },
    editAccount(item, index) {
      this.isEdit = true;
      this.editIndex = index;
      this.formData = { ...item };
      this.showAccountDialog = true;
    },
    deleteAccount(index) {
      uni.showModal({
        title: '提示',
        content: '确认删除该户号吗？',
        success: (res) => {
          if (res.confirm) {
            this.accountList.splice(index, 1);
            this.saveAccounts();
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
          }
        }
      });
    },
    onTypeConfirm(e) {
      this.formData.type = e.value[0].value;
      this.showTypePicker = false;
    },
    saveAccount() {
      // 验证必填项
      if (!this.formData.type) {
        uni.showToast({
          title: '请选择缴费类型',
          icon: 'none'
        });
        return;
      }
      if (!this.formData.city) {
        uni.showToast({
          title: '请输入城市',
          icon: 'none'
        });
        return;
      }
      if (!this.formData.payment_unit) {
        uni.showToast({
          title: '请输入缴费单位',
          icon: 'none'
        });
        return;
      }
      if (!this.formData.account_number || this.formData.account_number.length !== 13) {
        uni.showToast({
          title: '请输入13位户号',
          icon: 'none'
        });
        return;
      }
      
      if (this.isEdit) {
        // 编辑
        this.accountList[this.editIndex] = { ...this.formData };
      } else {
        // 新增
        this.accountList.push({ ...this.formData });
      }
      
      this.saveAccounts();
      this.showAccountDialog = false;
      uni.showToast({
        title: this.isEdit ? '编辑成功' : '添加成功',
        icon: 'success'
      });
    },
    saveAccounts() {
      // TODO: 保存到本地存储或服务器
      // uni.setStorageSync('life_payment_accounts', this.accountList);
    }
  }
};
</script>

<style lang="scss" scoped>
.account-management-page {
  width: 100%;
  min-height: 100vh;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.account-item {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 30rpx;
}

.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.account-type {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.type-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.account-actions {
  display: flex;
  gap: 30rpx;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.action-text {
  font-size: 26rpx;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.info-row {
  display: flex;
  align-items: center;
}

.info-label {
  font-size: 28rpx;
  color: #666666;
  min-width: 140rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333333;
  flex: 1;
}

.empty-state {
  padding-top: 200rpx;
}

.footer-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #FFFFFF;
  border-top: 1rpx solid #F0F0F0;
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
  gap: 10rpx;
}

.account-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.dialog-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.close-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-content {
  flex: 1;
  padding: 30rpx;
  overflow-y: auto;
}

.form-item {
  margin-bottom: 40rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 20rpx;
}

.required {
  color: #F44336;
  margin-left: 5rpx;
}

.form-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  background: #F5F5F5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333333;
}

.placeholder {
  color: #999999;
}

.form-input {
  width: 100%;
  height: 80rpx;
  background: #F5F5F5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333333;
}

.form-textarea {
  width: 100%;
  min-height: 200rpx;
  background: #F5F5F5;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #333333;
}

.dialog-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #F0F0F0;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  border: none;
  font-size: 32rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn {
  background: #F5F5F5;
  color: #666666;
}

.confirm-btn {
  background: linear-gradient(90deg, #4CAF50 0%, #45A049 100%);
  color: #FFFFFF;
}
</style>

