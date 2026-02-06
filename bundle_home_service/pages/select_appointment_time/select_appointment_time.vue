<template>
    <view class="select-appointment-time-page">
        <!-- 自定义导航栏 -->
        <custom-navbar title="上门时间" bg-color="linear-gradient(180deg, #149906 0%, #B3EE76 100%)"></custom-navbar>

        <!-- 内容区域 -->
        <view class="content-wrapper">
            <!-- 日期选择器 -->
            <view class="date-selector-wrapper">
                <scroll-view class="date-scroll" scroll-x>
                    <view class="date-list">
                        <view 
                            v-for="(date, index) in dateList" 
                            :key="index"
                            class="date-item"
                            :class="{ active: selectedDateIndex === index }"
                            @click="selectDate(index)"
                        >
                            <text class="date-label">{{ date.label }}</text>
                            <text class="date-value">{{ date.date }}</text>
                        </view>
                    </view>
                </scroll-view>
            </view>

            <!-- 时间段选择 -->
            <view class="time-period-section">
                <view class="time-period-item">
                    <view class="period-info">
                        <text class="period-name">上午</text>
                    </view>
                    <button 
                        class="select-btn"
                        :class="{ selected: selectedPeriod === 'morning' }"
                        @click="selectPeriod('morning')"
                    >
                        {{ selectedPeriod === 'morning' ? '已选择' : '选择' }}
                    </button>
                </view>

                <view class="time-period-item">
                    <view class="period-info">
                        <text class="period-name">下午</text>
                    </view>
                    <button 
                        class="select-btn"
                        :class="{ selected: selectedPeriod === 'afternoon' }"
                        @click="selectPeriod('afternoon')"
                    >
                        {{ selectedPeriod === 'afternoon' ? '已选择' : '选择' }}
                    </button>
                </view>
            </view>
        </view>

            <!-- 底部确认按钮（已移除，选择直接生效） -->
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

export default {
    name: 'SelectAppointmentTime',
    components: {
        CustomNavbar
    },
    data() {
        return {
            dateList: [],
            selectedDateIndex: 0,
            selectedPeriod: '' // 'morning' or 'afternoon'
        }
    },
    onLoad() {
        this.generateDateList();
    },
    methods: {
        generateDateList() {
            const list = [];
            const today = new Date();
            
            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                
                let label = '';
                if (i === 0) {
                    label = '今天';
                } else if (i === 1) {
                    label = '明天';
                } else if (i === 2) {
                    label = '后天';
                } else {
                    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                    label = weekDays[date.getDay()];
                }
                
                list.push({
                    label: label,
                    date: `${month}/${day}`,
                    fullDate: `${date.getFullYear()}-${month}-${day}`
                });
            }
            
            this.dateList = list;
        },
        selectDate(index) {
            this.selectedDateIndex = index;
        },
        selectPeriod(period) {
            this.selectedPeriod = period;
            // 选择后立即确认并返回
            this.confirmSelection();
        },
        confirmSelection() {
            if (!this.selectedPeriod) {
                uni.showToast({
                    title: '请选择时间段',
                    icon: 'none'
                });
                return;
            }
            
            const selectedDate = this.dateList[this.selectedDateIndex];
            const periodText = this.selectedPeriod === 'morning' ? '上午' : '下午';
            const timeText = `${selectedDate.fullDate} ${periodText}`;
            
            // 通过事件传递选中的时间
            uni.$emit('selectAppointmentTime', timeText);
            
            // 返回上一页
            uni.navigateBack();
        }
    }
}
</script>

<style lang="scss" scoped>
.select-appointment-time-page {
    width: 100%;
    min-height: 100vh;
    background-color: #F4F5F6;
    padding-top: 88px;
    display: flex;
    flex-direction: column;
}

.content-wrapper {
    flex: 1;
    padding: 20rpx;
}

.date-selector-wrapper {
    background-color: #FFFFFF;
    border-radius: 12rpx;
    padding: 30rpx 0;
    margin-bottom: 20rpx;
}

.date-scroll {
    width: 100%;
    white-space: nowrap;
}

.date-list {
    display: inline-flex;
    padding: 0 20rpx;
    gap: 20rpx;
}

.date-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 120rpx;
    padding: 20rpx 30rpx;
    background-color: #F5F5F5;
    border-radius: 12rpx;
    transition: all 0.3s;
}

.date-item.active {
    background: linear-gradient(180deg, #149906 0%, #B3EE76 100%);
}

.date-label {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 10rpx;
}

.date-item.active .date-label {
    color: #FFFFFF;
    font-weight: 500;
}

.date-value {
    font-size: 24rpx;
    color: #666666;
}

.date-item.active .date-value {
    color: #FFFFFF;
}

.time-period-section {
    background-color: #FFFFFF;
    border-radius: 12rpx;
    padding: 20rpx;
}

.time-period-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 20rpx;
    border-bottom: 1rpx solid #F0F0F0;
}

.time-period-item:last-child {
    border-bottom: none;
}

.period-info {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
}

.period-name {
    font-size: 32rpx;
    color: #333333;
    font-weight: 500;
}

.period-time {
    font-size: 24rpx;
    color: #999999;
}

.select-btn {
    min-width: 140rpx;
    height: 60rpx;
    line-height: 60rpx;
    padding: 0 30rpx;
    background: linear-gradient(90deg, #2B920A 0%, #E9F66B 100%);
    border-radius: 30rpx;
    font-size: 28rpx;
    color: #fff;
    text-align: center;
}

.select-btn::after {
    border: none;
}

.select-btn.selected {
    background: linear-gradient(180deg, #149906 0%, #B3EE76 100%);
    border-color: transparent;
    color: #FFFFFF;
}

.footer-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #FFFFFF;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    border-top: 1rpx solid #E0E0E0;
    z-index: 100;
}

.confirm-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(91.58deg, #49AB02 15.84%, #E4E872 83.36%, #EFFD6B 96.79%);
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 44rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.confirm-btn::after {
    border: none;
}
</style>
