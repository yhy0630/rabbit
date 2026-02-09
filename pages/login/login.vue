<template>
    <view></view>
</template>

<script>
export default {
    onLoad(options) {
        const query = Object.keys(options || {})
            .filter((key) => options[key] !== undefined)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`)
            .join('&')
        const url = '/bundle_main/pages/login/login' + (query ? `?${query}` : '')
        uni.redirectTo({ url })
    }
}
</script>
