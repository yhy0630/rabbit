<template>
    <view class="change-nickname">
        <custom-navbar title="修改昵称"></custom-navbar>

        <view class="content bg-white">
            <view class="field-row bdb-line">
                <input
                    class="field-input"
                    type="text"
                    v-model="nickname"
                    placeholder="请输入昵称"
                    placeholder-class="placeholder"
                />
            </view>

            <button class="submit-btn" @tap="submit" :disabled="loading">
                确认修改
            </button>
        </view>
    </view>
</template>

<script>
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { getUserInfo } from '@/api/user'

export default {
    name: 'changeNickname',
    components: {
        CustomNavbar
    },
    data() {
        return {
            nickname: '',
            loading: false
        }
    },
    onLoad() {
        // 预填当前昵称（仅用于展示，实际提交先不做校验）
        getUserInfo().then((res) => {
            if (res.code == 1) {
                this.nickname = res.data?.nickname || ''
            }
        })
    },
    methods: {
        submit() {
            if (this.loading) return
            if (!this.nickname) {
                this.$toast({ title: '请输入昵称' })
                return
            }

            // 暂时不校验接口：直接回传新昵称并返回上一页更新显示
            this.loading = true
            uni.setStorageSync('pending_user_nickname', this.nickname)
            uni.$emit('user_nickname_changed', { nickname: this.nickname })
            setTimeout(() => {
                this.loading = false
                uni.navigateBack({ delta: 1 })
            }, 200)
        }
    }
}
</script>

<style lang="scss">
.change-nickname {
    padding-top: 88px; // 为固定定位的导航栏留出空间（状态栏高度 + 导航栏高度）
    min-height: calc(100vh - env(safe-area-inset-bottom));
    background: #f8f8f8;

    .content {
        margin: 20rpx;
        border-radius: 24rpx;
        overflow: hidden;
        padding: 30rpx 24rpx 40rpx;
    }

    .field-row {
        height: 100rpx;
        display: flex;
        align-items: center;
    }

    .bdb-line {
        border-bottom: 1rpx solid #eeeeee;
    }

    .field-input {
        flex: 1;
        height: 100%;
        font-size: 30rpx;
        color: #333;
    }

    .placeholder {
        color: #c0c0c0;
        font-size: 28rpx;
    }

    .submit-btn {
        margin-top: 60rpx;
        height: 88rpx;
        line-height: 88rpx;
        border-radius: 44rpx;
        color: #fff;
        font-size: 32rpx;
        background: linear-gradient(91.58deg, #49AB02 15.84%, #E4E872 83.36%, #EFFD6B 96.79%);
    }

    .submit-btn[disabled] {
        opacity: 0.6;
    }
}
</style>


