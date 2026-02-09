<script>
import { mapActions, mapMutations } from 'vuex'
import { getConfig } from '@/api/app'
import { strToParams } from '@/utils/tools'
import { bindSuperior } from '@/api/user'
import { INVITE_CODE } from '@/config/cachekey'
import Cache from '@/utils/cache'
import { mapGetters } from 'vuex'

export default {
    onLaunch: function (options) {
        // 获取配置
        this.getConfigFun()
        this.getSystemInfo()
        this.getUser()
        //#ifdef MP-WEIXIN
        this.checkMpUpdate()
        //#endif
        //#ifdef H5
        const { clarity_app_id } = this.site_statistic

        if (clarity_app_id) {
            ;(function (c, l, a, r, i, t, y) {
                c[a] =
                    c[a] ||
                    function () {
                        ;(c[a].q = c[a].q || []).push(arguments)
                    }
                t = l.createElement(r)
                t.async = 1
                t.src = 'https://www.clarity.ms/tag/' + i
                y = l.getElementsByTagName(r)[0]
                y.parentNode.insertBefore(t, y)
            })(window, document, 'clarity', 'script', clarity_app_id)
        }

        //#endif
    },
    onShow: function (options) {
        console.log(options)
        this.bindCode(options)
    },
    onHide: function () {},
    computed: {
        ...mapGetters(['site_statistic'])
    },
    methods: {
        ...mapActions(['getSystemInfo', 'getUser', 'initLocationFunc']),
        ...mapMutations(['setConfig']),
        async getConfigFun() {
            const { code, data } = await getConfig()
            if (code == 1) {
                this.setConfig(data)
                // #ifdef H5
                let favicon = document.querySelector('link[rel="icon"]')
                if (favicon) {
                    favicon.href = data.web_favicon
                    return
                }
                favicon = document.createElement('link')
                favicon.rel = 'icon'
                favicon.href = data.web_favicon
                document.head.appendChild(favicon)
                // #endif

                // #ifndef MP
                if (data.is_open_nearby) {
                    // 获取定位
                    this.initLocationFunc()
                }
                // #endif
            }
        },
        async bindCode(options) {
            if (!options.query) return
            let invite_code =
                options.query.invite_code ||
                strToParams(decodeURIComponent(options.query.scene)).invite_code
            if (invite_code) {
                const { data, code } = await bindSuperior({
                    code: invite_code
                })
                if (code == -1) {
                    Cache.set(INVITE_CODE, invite_code)
                }
            }
        },
        //#ifdef MP-WEIXIN
        checkMpUpdate() {
            const updateManager = wx.getUpdateManager()
            updateManager.onUpdateReady(function () {
                wx.showModal({
                    title: '更新提示',
                    content: '新版本已准备好，是否重启？',
                    success: function (res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate()
                        }
                    }
                })
            })
        }
        //#endif
    }
}
</script>
<style lang="scss">
@import 'styles/common.scss';
@import 'components/uview-ui/index.scss';
/*每个页面公共css */
</style>
