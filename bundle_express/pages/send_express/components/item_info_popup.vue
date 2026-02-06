<template>
  <u-popup 
    v-model="show" 
    mode="bottom" 
    border-radius="20"
    :mask-close-able="true"
    height="80%"
  >
    <view class="item-info-popup">
      <view class="popup-header">
        <text class="popup-title">物品信息</text>
        <view class="close-btn" @click="close">
          <u-icon name="close" size="20" color="#666666"></u-icon>
        </view>
      </view>

      <scroll-view class="popup-content" scroll-y>
        <!-- 物品名称 -->
        <view class="form-item">
          <view class="form-label">
            <text>物品名称</text>
            <text class="required-badge">必填</text>
          </view>
          <view class="input-wrapper">
            <input 
              class="form-input" 
              type="text" 
              v-model="formData.name"
              placeholder="请输入物品名称" 
              placeholder-style="color: #999999;"
            />
            <view class="camera-icon" @click="takePhoto">
              <u-icon name="camera" size="24" color="#666666"></u-icon>
            </view>
          </view>
        </view>

        <!-- 物品分类 -->
        <view class="form-item">
          <view class="category-list">
            <view 
              v-for="(category, index) in categoryList" 
              :key="index"
              class="category-item"
              :class="{ active: formData.category === category }"
              @click="selectCategory(category)"
            >
              {{ category }}
            </view>
          </view>
        </view>

        <!-- 预估重量 -->
        <view class="form-item">
          <view class="form-label">
            <text>预估重量</text>
            <text class="required-badge">必填</text>
          </view>
          <view class="weight-control">
            <view class="control-btn" @click="decreaseWeight">-</view>
            <view class="weight-value">
              <text class="weight-number">{{ formData.weight }}</text>
              <text class="weight-unit">kg</text>
            </view>
            <view class="control-btn" @click="increaseWeight">+</view>
          </view>
        </view>

        <!-- 体积 -->
        <view class="form-item">
          <view class="form-label">
            <text>体积</text>
            <text class="optional-tip">填写体积计费预估更准确</text>
          </view>
          <view class="switch-wrapper">
            <u-switch 
              v-model="volumeEnabled" 
              active-color="#4CAF50"
              @change="onVolumeSwitchChange"
            ></u-switch>
          </view>
          <view class="volume-inputs" v-if="volumeEnabled">
            <input 
              class="volume-input" 
              type="number" 
              v-model="formData.length"
              placeholder="长(cm)" 
            />
            <text class="volume-separator">×</text>
            <input 
              class="volume-input" 
              type="number" 
              v-model="formData.width"
              placeholder="宽(cm)" 
            />
            <text class="volume-separator">×</text>
            <input 
              class="volume-input" 
              type="number" 
              v-model="formData.height"
              placeholder="高(cm)" 
            />
          </view>
        </view>

        <!-- 上门备注 -->
        <view class="form-item">
          <view class="form-label">上门备注</view>
          <textarea 
            class="form-textarea" 
            v-model="formData.remarks"
            placeholder="请输入备注信息（选填）" 
            placeholder-style="color: #999999;"
            maxlength="200"
          ></textarea>
        </view>
      </scroll-view>

      <!-- 确认按钮 -->
      <view class="popup-footer">
        <button class="confirm-btn" @click="confirm">确定</button>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    itemInfo: {
      type: Object,
      default: () => ({
        name: '',
        weight: 1,
        volume: '',
        remarks: ''
      })
    }
  },
  data() {
    return {
      show: false,
      formData: {
        name: '',
        category: '',
        weight: 1,
        length: '',
        width: '',
        height: '',
        volume: '',
        remarks: ''
      },
      volumeEnabled: false,
      categoryList: ['文件', '手机', '水果', '首饰', '羽绒服', '化妆品', '鞋子', '五金', '茶叶']
    };
  },
  watch: {
    itemInfo: {
      handler(newVal) {
        if (newVal) {
          this.formData = { ...this.formData, ...newVal };
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    showPopup() {
      this.show = true;
      if (this.itemInfo) {
        this.formData = { ...this.formData, ...this.itemInfo };
      }
    },
    close() {
      this.show = false;
    },
    takePhoto() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          // 可以调用OCR识别物品名称
          console.log('选择的图片:', res.tempFilePaths);
        }
      });
    },
    selectCategory(category) {
      this.formData.category = category;
      if (!this.formData.name) {
        this.formData.name = category;
      }
    },
    decreaseWeight() {
      if (this.formData.weight > 0.5) {
        this.formData.weight = (this.formData.weight - 0.5).toFixed(1);
      }
    },
    increaseWeight() {
      this.formData.weight = (parseFloat(this.formData.weight) + 0.5).toFixed(1);
    },
    onVolumeSwitchChange(value) {
      if (!value) {
        this.formData.length = '';
        this.formData.width = '';
        this.formData.height = '';
        this.formData.volume = '';
      }
    },
    confirm() {
      if (!this.formData.name) {
        uni.showToast({
          title: '请输入物品名称',
          icon: 'none'
        });
        return;
      }
      
      // 计算体积
      if (this.volumeEnabled && this.formData.length && this.formData.width && this.formData.height) {
        const volume = (parseFloat(this.formData.length) * 
                       parseFloat(this.formData.width) * 
                       parseFloat(this.formData.height) / 1000000).toFixed(3);
        this.formData.volume = volume + 'm³';
      }
      
      this.$emit('confirm', { ...this.formData });
      this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.item-info-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.popup-title {
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

.popup-content {
  flex: 1;
  padding: 30rpx;
  overflow-y: auto;
}

.form-item {
  margin-bottom: 40rpx;
}

.form-label {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #333333;
}

.required-badge {
  background: #FF6B9D;
  color: #FFFFFF;
  font-size: 20rpx;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
  margin-left: 10rpx;
}

.optional-tip {
  font-size: 24rpx;
  color: #999999;
  margin-left: 10rpx;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: #F5F5F5;
  border-radius: 8rpx;
  padding: 0 20rpx;
}

.form-input {
  flex: 1;
  height: 80rpx;
  font-size: 28rpx;
  color: #333333;
}

.camera-icon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.category-item {
  padding: 20rpx 30rpx;
  background: #F5F5F5;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #666666;
  border: 2rpx solid transparent;
}

.category-item.active {
  background: #E8F5E9;
  border-color: #4CAF50;
  color: #4CAF50;
}

.weight-control {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F5F5;
  border-radius: 8rpx;
  padding: 20rpx;
}

.control-btn {
  width: 60rpx;
  height: 60rpx;
  background: #FFFFFF;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: #666666;
  font-weight: bold;
}

.weight-value {
  flex: 1;
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.weight-number {
  font-size: 48rpx;
  font-weight: bold;
  color: #333333;
}

.weight-unit {
  font-size: 28rpx;
  color: #666666;
  margin-left: 10rpx;
}

.switch-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20rpx;
}

.volume-inputs {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.volume-input {
  flex: 1;
  height: 80rpx;
  background: #F5F5F5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  text-align: center;
}

.volume-separator {
  font-size: 32rpx;
  color: #666666;
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

.popup-footer {
  padding: 30rpx;
  border-top: 1rpx solid #F0F0F0;
}

.confirm-btn {
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

