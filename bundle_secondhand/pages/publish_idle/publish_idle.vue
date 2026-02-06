<template>
  <view class="publish-idle-page">
    <!-- 顶部导航栏 -->
    <view class="header-navbar">
      <view class="navbar-content">
        <view class="close-btn" @click="goBack">
          <u-icon name="close" size="20" color="#333333"></u-icon>
        </view>
        <view class="navbar-title">发闲置</view>
        <button class="publish-btn" @click="publish" :disabled="!canPublish">发布</button>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <!-- 图片上传区域 -->
      <view class="image-upload-section">
        <view class="image-list">
          <view 
            class="image-item"
            v-for="(img, index) in imageList"
            :key="index"
          >
            <image :src="img" mode="aspectFill" class="uploaded-image"></image>
            <view class="delete-btn" @click="deleteImage(index)">
              <u-icon name="close" size="16" color="#FFFFFF"></u-icon>
            </view>
          </view>
          <view 
            class="image-item upload-placeholder"
            v-if="imageList.length < 9"
            @click="chooseImage"
          >
            <u-icon name="plus" size="40" color="#CCCCCC"></u-icon>
            <text class="upload-text">添加优质</text>
            <text class="upload-text">首图更吸引人~</text>
          </view>
        </view>
      </view>

      <!-- 表单区域 -->
      <view class="form-section">
        <!-- 价格 -->
        <view class="form-item" @click="showPriceInput">
          <text class="form-label">价格</text>
          <view class="form-value">
            <text class="price-text" :class="{ placeholder: !formData.price }">
              {{ formData.price ? '¥' + parseFloat(formData.price).toFixed(2) : '¥0.00' }}
            </text>
            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
          </view>
        </view>

        <!-- 分类 -->
        <view class="form-item" @click="showCategoryPicker = true">
          <text class="form-label">分类</text>
          <view class="form-value">
            <text class="value-text" :class="{ placeholder: !formData.category_name }">
              {{ formData.category_name || '请选择 >' }}
            </text>
            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
          </view>
        </view>

        <!-- 品牌 -->
        <view class="form-item">
          <text class="form-label">品牌</text>
          <input 
            class="form-input" 
            v-model="formData.brand"
            placeholder="请输入"
            placeholder-style="color: #CCCCCC;"
          />
        </view>

        <!-- 运费 -->
        <view class="form-item">
          <text class="form-label">运费</text>
          <input 
            class="form-input" 
            type="digit"
            v-model="formData.shipping_fee"
            placeholder="请输入"
            placeholder-style="color: #CCCCCC;"
          />
        </view>

        <!-- 成色 -->
        <view class="form-item" @click="showConditionPicker = true">
          <text class="form-label">成色</text>
          <view class="form-value">
            <text class="value-text" :class="{ placeholder: !formData.condition }">
              {{ formData.condition || '九成新 >' }}
            </text>
            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
          </view>
        </view>

        <!-- 地址 -->
        <view class="form-item" @click="selectAddress">
          <text class="form-label">地址</text>
          <view class="form-value">
            <text class="value-text" :class="{ placeholder: !formData.address }">
              {{ formData.address || '北京 >' }}
            </text>
            <u-icon name="arrow-right" size="16" color="#CCCCCC"></u-icon>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 价格输入弹窗 -->
    <u-popup 
      v-model="showPriceDialog" 
      mode="center" 
      border-radius="20"
      width="600rpx"
    >
      <view class="price-dialog">
        <view class="dialog-title">设置价格</view>
        <view class="price-input-wrapper">
          <text class="currency">¥</text>
          <input 
            class="price-input" 
            type="digit"
            v-model="priceInput"
            placeholder="0.00"
            :focus="showPriceDialog"
          />
        </view>
        <view class="dialog-footer">
          <button class="cancel-btn" @click="showPriceDialog = false">取消</button>
          <button class="confirm-btn" @click="confirmPrice">确定</button>
        </view>
      </view>
    </u-popup>

    <!-- 分类选择器 -->
    <u-picker
      :show="showCategoryPicker"
      :columns="[categoryList]"
      keyName="name"
      @confirm="onCategoryConfirm"
      @cancel="showCategoryPicker = false"
    ></u-picker>

    <!-- 成色选择器 -->
    <u-picker
      :show="showConditionPicker"
      :columns="[conditionList]"
      keyName="label"
      @confirm="onConditionConfirm"
      @cancel="showConditionPicker = false"
    ></u-picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imageList: [],
      formData: {
        price: '',
        category_id: 0,
        category_name: '',
        brand: '',
        shipping_fee: '',
        condition: '',
        address: '北京',
        address_detail: ''
      },
      priceInput: '',
      showPriceDialog: false,
      showCategoryPicker: false,
      showConditionPicker: false,
      categoryList: [
        { id: 1, name: '数码电子' },
        { id: 2, name: '服装配饰' },
        { id: 3, name: '家居用品' },
        { id: 4, name: '图书音像' },
        { id: 5, name: '运动户外' },
        { id: 6, name: '美妆护肤' },
        { id: 7, name: '其他' }
      ],
      conditionList: [
        { label: '全新', value: '全新' },
        { label: '九成新', value: '九成新' },
        { label: '八成新', value: '八成新' },
        { label: '七成新', value: '七成新' },
        { label: '六成新', value: '六成新' },
        { label: '五成新及以下', value: '五成新及以下' }
      ]
    };
  },
  computed: {
    canPublish() {
      return this.imageList.length > 0 && 
             this.formData.price && 
             parseFloat(this.formData.price) > 0 &&
             this.formData.category_id > 0;
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    chooseImage() {
      const remaining = 9 - this.imageList.length;
      uni.chooseImage({
        count: remaining,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          // TODO: 上传图片到服务器获取URL
          // 暂时使用本地路径
          this.imageList = [...this.imageList, ...res.tempFilePaths];
        }
      });
    },
    deleteImage(index) {
      this.imageList.splice(index, 1);
    },
    showPriceInput() {
      this.priceInput = this.formData.price || '';
      this.showPriceDialog = true;
    },
    confirmPrice() {
      if (this.priceInput && parseFloat(this.priceInput) >= 0) {
        this.formData.price = parseFloat(this.priceInput).toFixed(2);
      }
      this.showPriceDialog = false;
    },
    onCategoryConfirm(e) {
      const selected = e.value[0];
      this.formData.category_id = selected.id;
      this.formData.category_name = selected.name;
      this.showCategoryPicker = false;
    },
    onConditionConfirm(e) {
      const selected = e.value[0];
      this.formData.condition = selected.value;
      this.showConditionPicker = false;
    },
    selectAddress() {
      uni.showToast({
        title: '选择地址',
        icon: 'none'
      });
      // TODO: 跳转到地址选择页面
    },
    async publish() {
      if (!this.canPublish) {
        uni.showToast({
          title: '请完善必填信息',
          icon: 'none'
        });
        return;
      }

      uni.showLoading({
        title: '发布中...'
      });

      try {
        // TODO: 调用发布接口
        // const res = await publishIdleItem({
        //   images: this.imageList.join(','),
        //   ...this.formData
        // });

        // 模拟发布成功
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: '发布成功',
            icon: 'success'
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }, 2000);
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: '发布失败，请重试',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.publish-idle-page {
  width: 100%;
  min-height: 100vh;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
}

.header-navbar {
  width: 100%;
  background: #FFFFFF;
  border-bottom: 1rpx solid #F0F0F0;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  height: 88rpx;
}

.close-btn {
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
  color: #333333;
}

.publish-btn {
  height: 60rpx;
  padding: 0 30rpx;
  background: #4CAF50;
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: bold;
  border-radius: 30rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.publish-btn:disabled {
  background: #CCCCCC;
  color: #FFFFFF;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
}

.image-upload-section {
  background: #FFFFFF;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.image-item {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  position: relative;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
}

.delete-btn {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background: #F44336;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-placeholder {
  background: #F5F5F5;
  border: 2rpx dashed #CCCCCC;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}

.upload-text {
  font-size: 24rpx;
  color: #CCCCCC;
}

.form-section {
  background: #FFFFFF;
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  font-size: 28rpx;
  color: #333333;
  min-width: 120rpx;
}

.form-value {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10rpx;
}

.value-text {
  font-size: 28rpx;
  color: #333333;
}

.value-text.placeholder {
  color: #CCCCCC;
}

.price-text {
  font-size: 28rpx;
  color: #F44336;
  font-weight: bold;
}

.price-text.placeholder {
  color: #F44336;
}

.form-input {
  flex: 1;
  text-align: right;
  font-size: 28rpx;
  color: #333333;
}

.price-dialog {
  padding: 40rpx;
}

.dialog-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  text-align: center;
  margin-bottom: 40rpx;
}

.price-input-wrapper {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border: 1rpx solid #E0E0E0;
  border-radius: 8rpx;
  margin-bottom: 40rpx;
}

.currency {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-right: 10rpx;
}

.price-input {
  flex: 1;
  font-size: 32rpx;
  color: #333333;
}

.dialog-footer {
  display: flex;
  gap: 20rpx;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  border: none;
  font-size: 28rpx;
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
  background: #4CAF50;
  color: #FFFFFF;
}
</style>

