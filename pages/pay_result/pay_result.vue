<template>
    <view></view>
</template>

<script>
export default {
    onLoad(options) {
        console.log('[pay_result重定向调试] 接收到参数:', options);
        console.log('[pay_result重定向调试] 参数类型:', typeof options);
        console.log('[pay_result重定向调试] 参数键值:', Object.keys(options || {}));
        
        try {
            const query = Object.keys(options || {})
                .filter((key) => options[key] !== undefined && options[key] !== null && options[key] !== '')
                .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`)
                .join('&')
            
            const url = '/bundle_main/pages/pay_result/pay_result' + (query ? `?${query}` : '')
            
            console.log('[pay_result重定向调试] 构建的查询字符串:', query);
            console.log('[pay_result重定向调试] 最终跳转URL:', url);
            
            // 使用 nextTick 延迟跳转，确保页面初始化完成
            this.$nextTick(() => {
                console.log('[pay_result重定向调试] nextTick 回调执行，开始跳转');
                uni.redirectTo({ 
                    url,
                    success: (res) => {
                        console.log('[pay_result重定向调试] redirectTo 跳转成功:', res);
                    },
                    fail: (err) => {
                        console.error('[pay_result重定向调试] redirectTo 跳转失败:', err);
                        // 如果 redirectTo 失败，尝试使用 navigateTo
                        uni.navigateTo({
                            url,
                            success: (res) => {
                                console.log('[pay_result重定向调试] navigateTo 跳转成功:', res);
                            },
                            fail: (err2) => {
                                console.error('[pay_result重定向调试] navigateTo 跳转也失败:', err2);
                                // 如果都失败，尝试使用 reLaunch
                                uni.reLaunch({
                                    url,
                                    success: (res) => {
                                        console.log('[pay_result重定向调试] reLaunch 跳转成功:', res);
                                    },
                                    fail: (err3) => {
                                        console.error('[pay_result重定向调试] reLaunch 跳转也失败:', err3);
                                        uni.showToast({
                                            title: '跳转支付结果页面失败',
                                            icon: 'none'
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
        } catch (error) {
            console.error('[pay_result重定向调试] 处理参数时出错:', error);
            uni.showToast({
                title: '参数处理失败',
                icon: 'none'
            });
        }
    }
}
</script>
