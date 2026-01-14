# 自定义底部导航栏组件使用说明

## 组件说明
这是一个自定义的底部导航栏组件，使用背景图片 `/static/picture/bottom_bar.png` 作为导航栏背景，支持5个导航项的弧形布局。

## 使用方法

### 1. 在页面中引入组件

```vue
<template>
  <view class="page">
    <!-- 页面内容 -->
    <view class="content">
      <!-- 你的页面内容 -->
    </view>
    
    <!-- 自定义导航栏 -->
    <custom-tabbar :current="currentTab" @change="onTabChange"></custom-tabbar>
  </view>
</template>

<script>
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'

export default {
  components: {
    CustomTabbar
  },
  data() {
    return {
      currentTab: 0 // 当前选中的tab索引
    }
  },
  methods: {
    onTabChange(index) {
      this.currentTab = index
      console.log('切换到tab:', index)
    }
  }
}
</script>

<style>
.page {
  padding-bottom: 120rpx; /* 给导航栏留出空间，避免内容被遮挡 */
}
</style>
```

### 2. 在 pages.json 中隐藏原生导航栏

在需要使用自定义导航栏的页面配置中，添加以下配置：

```json
{
  "path": "pages/your-page/your-page",
  "style": {
    "navigationBarTitleText": "页面标题",
    "app-plus": {
      "titleNView": false
    }
  }
}
```

或者在页面的 style 中设置：

```json
"style": {
  "navigationStyle": "custom"
}
```

### 3. 替换图标

组件中预设了临时图标路径，你需要将实际的图标文件放到对应位置，或者修改 `iconList` 中的路径：

```javascript
iconList: [
  {
    normal: '/static/picture/icon_home.png',      // 首页未选中图标
    selected: '/static/picture/icon_home_s.png',  // 首页选中图标
    path: '/pages/index/index'
  },
  // ... 其他配置
]
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| current | Number | 0 | 当前选中的tab索引（0-4） |

## 组件事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | tab切换时触发 | index: 当前选中的索引 |

## 导航项配置

当前配置的5个导航项：

1. **首页** (index: 0) - 跳转到 `/pages/index/index`
2. **商城** (index: 1) - 跳转到 `/pages/goods_cate/goods_cate`
3. **发布** (index: 2) - 跳转到 `/bundle_b/pages/published_works/published_works`
4. **订单** (index: 3) - 跳转到 `/bundle/pages/user_order/user_order`
5. **我的** (index: 4) - 跳转到 `/pages/user/user`

## 弧形布局说明

导航项采用弧形布局，高度从两边到中间递增：
- 第1、5项（首页、我的）：最低
- 第2、4项（商城、订单）：中等高度（向上偏移20rpx）
- 第3项（发布）：最高（向上偏移40rpx，图标也更大）

## 样式调整

如需调整弧形的高度差，可以修改组件中的 `padding-bottom` 值：

```scss
// 第二个和第四个的高度
.item-2,
.item-4 {
  padding-bottom: 20rpx; // 调整这个值
}

// 第三个（中间）的高度
.item-3 {
  padding-bottom: 40rpx; // 调整这个值
}
```

## 注意事项

1. 确保背景图片 `/static/picture/bottom_bar.png` 存在
2. 组件使用 `position: fixed` 固定在底部，记得给页面内容留出底部空间
3. 图标路径需要根据实际情况调整
4. 如果页面是 tabBar 页面，跳转会使用 `uni.switchTab`，否则使用 `uni.navigateTo`
