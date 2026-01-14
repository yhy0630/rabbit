// 开发者环境：开|关	【注：方便微信小程序发行测试】
const SWITCH_DEVELOPMENT = false

/** S 是否H5端 **/
// #ifdef H5
const IS_H5 = true
// #endif

// #ifndef H5
const IS_H5 = false
// #endif
/** E 是否H5端 **/

/** S API BaseURL **/
// const baseURLMap = {
// 	// 开发环境
// 	development: 'https://php-b2b2c.yixiangonline.com',
// 	// 生产环境 https://b2b2c.likeshop.cn
// 	production: IS_H5 ? location.origin : ''
// }
const baseURLMap = {
    // 开发环境
    development: process.env.VUE_APP_BASE_API,
    // 生产环境
    production: IS_H5
        ? location.origin
        : process.env.VUE_APP_BASE_API
        ? process.env.VUE_APP_BASE_API
        : '[baseUrl]'
}

// const baseURL = SWITCH_DEVELOPMENT ? baseURLMap['development'] : baseURLMap[process.env.NODE_ENV]
const baseURL = baseURLMap[process.env.NODE_ENV]

/** E API BaseURL **/

module.exports = {
	version: '3.1.0', // 版本号
	baseURL, // API Base URL
	basePath: '/mobile'
}