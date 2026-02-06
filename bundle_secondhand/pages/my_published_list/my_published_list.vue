<template>
  <view class="my-published-list-page">
    <!-- 主要内容区域 -->
    <scroll-view class="content-scroll" scroll-y @scrolltolower="loadMore">
      <!-- 标签页 -->
      <view class="tabs-container">
        <view 
          class="tab-item" 
          v-for="(tab, index) in tabs"
          :key="index"
          :class="{ active: currentTab === index }"
          @click="switchTab(index)"
        >
          <text>{{ tab.name }}</text>
        </view>
      </view>

      <!-- 列表 -->
      <view class="list-container" v-if="itemList.length > 0">
        <view 
          class="list-item"
          v-for="(item, index) in itemList"
          :key="index"
          @click="viewDetail(item)"
        >
          <image class="item-image" :src="item.images[0]" mode="aspectFill"></image>
          <view class="item-content">
            <view class="item-header">
              <text class="item-title">{{ item.title }}</text>
            </view>
            <view class="item-info">
              <text class="item-price">¥{{ item.price }}</text>
            </view>
            <view class="item-actions">
              <button 
                class="action-btn" 
                @click.stop="delistItem(item, index)"
                v-if="item.status === 1"
              >
                下架
              </button>
              <button 
                class="action-btn" 
                @click.stop="deleteItem(item, index)"
              >
                删除
              </button>
              <button 
                class="action-btn" 
                @click.stop="editItem(item)"
              >
                编辑
              </button>
            </view>
          </view>
        </view>
        
        <!-- 加载更多 -->
        <view class="load-more" v-if="hasMore">
          <text class="load-text">{{ loading ? '加载中...' : '上拉加载更多' }}</text>
        </view>
        <view class="load-more" v-else>
          <text class="load-text">没有更多了</text>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-else>
        <u-empty mode="data" text="暂无发布记录"></u-empty>
        <button class="publish-btn" @click="goToPublish">发布闲置</button>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 0,
      tabs: [
        { name: '在卖', status: 1 },
        { name: '已下架', status: 0 }
      ],
      itemList: [
        {
          id: 1,
          title: '纽翠斯猫粮高蛋白无谷黑钻冻干红肉猫粮',
          images: ['/static/images/item1.jpg'],
          price: '56.50',
          status: 1,
          publish_time: '2026-02-05 10:30:00'
        },
        {
          id: 2,
          title: '纽翠斯猫粮高蛋白无谷黑钻冻干红肉猫粮',
          images: ['/static/images/item2.jpg'],
          price: '56.50',
          status: 1,
          publish_time: '2026-02-04 15:20:00'
        },
        {
          id: 3,
          title: '纽翠斯猫粮高蛋白无谷黑钻冻干红肉猫粮',
          images: ['/static/images/item3.jpg'],
          price: '56.50',
          status: 1,
          publish_time: '2026-02-03 09:15:00'
        },
        {
          id: 4,
          title: '纽翠斯猫粮高蛋白无谷黑钻冻干红肉猫粮',
          images: ['/static/images/item4.jpg'],
          price: '56.50',
          status: 0,
          publish_time: '2026-02-02 14:45:00'
        }
      ],
      page: 1,
      limit: 20,
      hasMore: true,
      loading: false
    };
  },
  onLoad() {
    this.loadList();
  },
  methods: {
    switchTab(index) {
      this.currentTab = index;
      this.page = 1;
      this.hasMore = true;
      this.loadList();
    },
    loadList() {
      if (this.loading) return;
      
      this.loading = true;
      
      // TODO: 调用接口加载列表
      // const status = this.tabs[this.currentTab].status;
      // const res = await getMyPublishedList({
      //   status: status,
      //   page: this.page,
      //   limit: this.limit
      // });
      
      // 模拟数据过滤
      const status = this.tabs[this.currentTab].status;
      let filteredList = this.itemList;
      if (status !== '') {
        filteredList = this.itemList.filter(item => item.status === status);
      }
      
      setTimeout(() => {
        this.loading = false;
        // this.itemList = res.data || [];
        // this.hasMore = res.hasMore || false;
      }, 500);
    },
    loadMore() {
      if (!this.hasMore || this.loading) return;
      this.page++;
      this.loadList();
    },
    delistItem(item, index) {
      uni.showModal({
        title: '提示',
        content: '确认下架该商品吗？',
        success: (res) => {
          if (res.confirm) {
            // TODO: 调用下架接口
            item.status = 0;
            uni.showToast({
              title: '下架成功',
              icon: 'success'
            });
            // 如果当前在"在卖"标签，需要刷新列表
            if (this.currentTab === 0) {
              this.loadList();
            }
          }
        }
      });
    },
    viewDetail(item) {
      uni.showToast({
        title: '查看详情',
        icon: 'none'
      });
      // TODO: 跳转到详情页面
    },
    editItem(item) {
      uni.navigateTo({
        url: `/bundle_secondhand/pages/publish_idle/publish_idle?id=${item.id}&edit=1`
      });
    },
    deleteItem(item, index) {
      uni.showModal({
        title: '提示',
        content: '确认删除该商品吗？',
        success: (res) => {
          if (res.confirm) {
            // TODO: 调用删除接口
            this.itemList.splice(index, 1);
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
          }
        }
      });
    },
    goToPublish() {
      uni.navigateTo({
        url: '/bundle_secondhand/pages/publish_idle/publish_idle'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.my-published-list-page {
  width: 100%;
  min-height: 100vh;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
}

.tabs-container {
  display: flex;
  background: #FFFFFF;
  border-bottom: 1rpx solid #F0F0F0;
}

.tab-item {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #666666;
  position: relative;
}

.tab-item.active {
  color: #4CAF50;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  background: #4CAF50;
  border-radius: 2rpx;
}

.list-container {
  padding: 20rpx;
}

.list-item {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  gap: 20rpx;
}

.item-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-header {
  margin-bottom: 15rpx;
}

.item-title {
  font-size: 28rpx;
  color: #333333;
  line-height: 1.5;
}

.item-info {
  margin-bottom: 20rpx;
}

.item-price {
  font-size: 32rpx;
  font-weight: bold;
  color: #F44336;
}

.item-actions {
  display: flex;
  gap: 15rpx;
  justify-content: flex-end;
}

.action-btn {
  padding: 8rpx 24rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  border: 1rpx solid #E0E0E0;
  background: #FFFFFF;
  color: #666666;
  display: flex;
  align-items: center;
  justify-content: center;
}

.load-more {
  padding: 30rpx;
  text-align: center;
}

.load-text {
  font-size: 24rpx;
  color: #999999;
}

.empty-state {
  padding-top: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40rpx;
}

.publish-btn {
  width: 400rpx;
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

