<template>
  <view class="address-edit-page">
    <view class="form-container">
      <u-field
        v-model="addressObj.contact"
        label="联系人"
        placeholder="请填写联系人姓名"
      ></u-field>
      
      <u-field
        v-model="addressObj.telephone"
        label="联系方式"
        placeholder="请填写手机号码"
        type="number"
      ></u-field>
      
      <view @click="showRegion = true">
        <u-field
          v-model="region"
          :disabled="true"
          label="所在地区"
          placeholder="请选择省、市、区"
          right-icon="arrow-right"
        ></u-field>
      </view>
      
      <view>
        <u-field
          v-model="addressObj.address"
          type="textarea"
          label="详细地址"
          placeholder="请填写小区、街道、门牌号等信息"
          :field-style="{ flex: 1, height: '200rpx' }"
        />
      </view>
    </view>
    
    <view class="default-section">
      <u-checkbox
        @click="changeDefault"
        v-model="addressObj.is_default"
        shape="circle"
      >
        <text class="checkbox-text">设置为默认</text>
      </u-checkbox>
    </view>
    
    <button class="submit-btn" @tap="formSubmit">完成</button>
    
    <u-select
      v-model="showRegion"
      mode="mutil-column-auto"
      @confirm="regionChange"
      :list="lists"
    ></u-select>
  </view>
</template>

<script>
import {
  editAddress,
  getOneAddress,
  hasRegionCode,
  addAddress,
} from "@/api/user";
import area from "@/utils/area";

export default {
  data() {
    return {
      addressObj: {
        contact: "",
        telephone: "",
        province: "",
        city: "",
        district: "",
        address: "",
        is_default: false,
      },
      region: "",
      addressId: "",
      addressType: 'sender', // sender 或 receiver
      defaultRegion: ["广东省", "广州市", "番禺区"],
      defaultRegionCode: "440113",
      showRegion: false,
      lists: [],
    };
  },
  onLoad: function (options) {
    this.addressId = options.id ? parseInt(options.id) : '';
    this.addressType = options.type || 'sender';
    
    if (this.addressId) {
      uni.setNavigationBarTitle({
        title: "编辑地址",
      });
      this.getOneAddressFun();
    } else {
      uni.setNavigationBarTitle({
        title: "添加地址",
      });
      this.getWxAddressFun();
    }
    this.$nextTick(() => {
      this.lists = area;
    });
  },
  onUnload: function () {
    uni.removeStorageSync("wxAddress");
  },
  methods: {
    async formSubmit() {
      let {
        addressObj: {
          contact,
          telephone,
          province_id,
          city_id,
          district_id,
          is_default,
          address,
        },
        addressId,
        region,
      } = this;
      
      if (!contact)
        return this.$toast({
          title: "请填写联系人姓名",
        });
      if (!telephone)
        return this.$toast({
          title: "请填写手机号码",
        });
      if (!region)
        return this.$toast({
          title: "请选择省、市、区",
        });
      if (!address)
        return this.$toast({
          title: "请填写详细地址",
        });
      
      const params = {
        contact,
        telephone,
        province_id: parseInt(province_id),
        city_id: parseInt(city_id),
        district_id: parseInt(district_id),
        is_default: is_default ? 1 : 0,
        id: addressId,
        address,
      };
      
      const { code, msg } = addressId
        ? await editAddress(params)
        : await addAddress(params);
      
      if (code == 1) {
        this.$toast({
          title: msg,
        });
        
        // 返回地址列表
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    },
    regionChange(region) {
      this.addressObj.province_id = region[0].value;
      this.addressObj.city_id = region[1].value;
      this.addressObj.district_id = region[2].value;
      this.region =
        region[0].label + " " + region[1].label + " " + region[2].label;
    },
    getOneAddressFun() {
      getOneAddress(this.addressId).then((res) => {
        if (res.code == 1) {
          let { city, province, district } = res.data;
          this.addressObj = res.data;
          this.region = `${province} ${city} ${district}`;
        }
      });
    },
    getWxAddressFun() {
      let wxAddress = uni.getStorageSync("wxAddress");
      if (!wxAddress) return;
      wxAddress = JSON.parse(wxAddress);
      let {
        userName: contact,
        telNumber: telephone,
        provinceName: province,
        cityName: city,
        detailInfo: address,
      } = wxAddress;
      let district = wxAddress.countryName || wxAddress.countyName;
      hasRegionCode({
        province,
        city,
        district,
      }).then((res) => {
        if (res.code == 1) {
          if (res.data.province && res.data.city && res.data.district) {
            this.region = `${province} ${city} ${district}`;
            this.addressObj.province_id = res.data.province;
            this.addressObj.city_id = res.data.city;
            this.addressObj.district_id = res.data.district;
          }
          this.addressObj.contact = contact;
          this.addressObj.telephone = telephone;
          this.addressObj.address = address;
        }
      });
    },
    changeDefault() {
      // checkbox 点击事件已处理
    },
  },
};
</script>

<style lang="scss" scoped>
.address-edit-page {
  padding-top: 20rpx;
  min-height: 100vh;
  background-color: #F5F5F5;
}

.form-container {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 0 20rpx 20rpx;
  overflow: hidden;
}

.default-section {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 0 20rpx 20rpx;
  padding: 30rpx;
}

.checkbox-text {
  font-size: 28rpx;
  color: #333333;
}

.submit-btn {
  margin: 30rpx 26rpx;
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

