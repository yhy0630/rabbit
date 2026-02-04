<template>
	<view>
		<custom-navbar title="推广中心" :bg-color="'#189B07'"></custom-navbar>
		<loading-view v-if="showLoading"></loading-view>
		<u-notice-bar :show="showTips" mode="horizontal" :list="list" :font-size="26" :close-icon="true" :speed="100"
			@close="showTips=false"></u-notice-bar>
		<view class="user-spread">
			<view class="header p-t-40 m-b-50">
				<view class="user-info flex m-l-30">
					<view class="user-avatar">
						<u-image width="110rpx" height="110rpx" border-radius="60" :src="userInfo.user.avatar" />
					</view>
					<view class="user-message m-l-20 white">
						<view class="m-b-10">
							<view class="xxl bold  m-r-20">{{userInfo.user.nickname}}</view>
						</view>
						<!-- <view class="avatar-tag white xxs text-center m-b-10" v-if="distributionInfo.level_name">{{distributionInfo.level_name}}</view> -->
						<view class="xs flex">
							上级分销商：{{userInfo.leader.nickname ? userInfo.leader.nickname :  '无'}}
							<view v-if="!userInfo.leader.nickname"
								class="br60 white write-btn flex row-center m-l-30 xxs" @tap="showInvitePop">填写
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="main">
				<!-- 填表格 -->
				<view v-if="vipState == 0" class="user-apply-box">
					<view class="user-apply-vip flex-col col-center">
						<view class="user-apply-header flex-col col-center">
							<view class="title xxl normal">申请成为分销会员</view>
						</view>
						<view class="vip-form">
							<view class="form-item">
								<u-field v-model="realName" :label-width="150" label="真实姓名：" :border-bottom="false"
									placeholder="请输入您的真实姓名">
								</u-field>
							</view>

							<view class="form-item">
								<u-field v-model="mobile" :label-width="150" label="手机号码：" :border-bottom="false"
									placeholder="请输入您的手机号码">
								</u-field>
							</view>
							<view class="form-item" @tap="showRegion=true">
								<u-field v-model="region" disabled right-icon="arrow-right" :label-width="150"
									label="现住省份：" :border-bottom="false" placeholder="请选择省、市、区">
								</u-field>
							</view>
							<view class="form-item">
								<u-field v-model="reason" :label-width="150" type="textarea" label="申请原因："
									placeholder="（必填）" :field-style="{ height: '250rpx'}" />
							</view>
						</view>
					</view>
					<button class="apply-btn bg-primary white md m-t-20 flex row-center br60" @tap="formSubmit">
						立即申请
					</button>
					<view class="m-t-20 xxs lighter flex row-center">提交成功后，我们将会在1-2个工作日内给您回复</view>
				</view>

				<!-- 申请状态 -->
				<view v-if="vipState==1" class="user-result-box">
					<view class="user-result flex-col col-center">
						<view class="user-result-header flex-col col-center">
							<view class="title xxl normal">申请成为分销会员</view>
						</view>
						<view class="user-result-content flex-col col-center">
							<image class="apply-result-img"
								:src="applyObject.status == 2 ? '/static/images/icon_fail.png' : '/static/images/icon_success.png'" />
							<view class="m-t-10 nr" style="line-height: 40rpx">{{applyObject.status_str}}</view>
							<view class="apply-fail-reason sm"
								:style="applyObject == 2 ? 'visibility: none' : 'visibility: hidden'">
								{{applyObject.reason}}
							</view>
						</view>
						<view class="user-result-info">
							<view class="info-item flex nr">
								<view class="label">真实姓名：</view>
								<view class="info-text ml20">{{applyObject.real_name}}</view>
							</view>
							<view class="info-item flex nr">
								<view class="label">手机号码：</view>
								<view class="info-text ml20">{{applyObject.mobile}}</view>
							</view>
							<view class="info-item flex nr">
								<view class="label">现住省份：</view>
								<view class="info-text ml20">{{applyObject.province}} {{applyObject.city}}
									{{applyObject.district}}
								</view>
							</view>
							<view class="info-item flex nr">
								<view class="label">申请原因：</view>
								<view class="info-text ml20">{{applyObject.reason ? applyObject.reason : '-'}}</view>
							</view>
						</view>
					</view>
					<view :class="'white m-t-20 br60 apply-btn flex row-center md bg-primary'" @tap="reApply">重新申请
					</view>
					<view class="m-t-20 xxs lighter flex row-center">提交成功后，我们将会在1-2个工作日内给您回复</view>
				</view>

				<!-- 已申请 -->
				<view v-if="vipState==2" class="user-vip">
					<view class="user-assets-box">
						<view class="user-assets-header">
							<view class="header-title-row flex row-between">
								<view class="header-title">我的钱包</view>
								<view class="header-link" @tap="goToCommissionDetails">收益明细 <u-icon name="arrow-right" size="28rpx" color="#666"></u-icon></view>
							</view>
							<view class="balance-display flex-col col-center">
								<price-format 
									weight="bold" 
									:first-size="96" 
									:subscript-size="60" 
									:second-size="96"
									:price="distributionInfo.able_withdrawal" 
									:color="'#1B8902'" 
								/>
							</view>
							<navigator hover-class="none" class="withdraw-btn white flex row-center"
								url="/bundle/pages/user_withdraw/user_withdraw">申请提现</navigator>
						</view>
						<!-- <view class="user-assets-content flex  flex-wrap">
							<view class="user-item flex-col col-center">
								<tool-tip v-if="false" class="m-t-20" id="today-profit" content="今日预估收益金额"
									style="position: absolute;right: -66rpx;"></tool-tip>
								<view class="nr user-assets-name flex" style="color: #8F430E">
									今日预估收益
									<u-icon class="ml10" name="question-circle" size="30rpx" color="#D88D5A" />
								</view>
								<view class="assets m-l-20">
									<price-format weight="bold" :first-size="36" :subscript-size="26" :second-size="36"
										:price="distributionInfo.today_earnings" :color="colorConfig.primary" />
								</view>
							</view>
							<view class="user-item flex-col col-center">
								<view class="nr user-assets-name flex" style="color: #8F430E">
									本月预估收益
									<u-icon class="ml10" name="question-circle" size="30rpx" color="#D88D5A" />
								</view>
								<view class="assets m-l-20">
									<price-format weight="bold" :first-size="36" :subscript-size="26" :second-size="36"
										:price="distributionInfo.month_earnings" :color="colorConfig.primary" />
								</view>
							</view>
							<view class="user-item flex-col col-center">
								<view class="nr user-assets-name flex" style="color: #8F430E">
									累计获得收益
									<u-icon class="ml10" name="question-circle" size="30rpx" color="#D88D5A" />
								</view>
								<view class="assets">
									<price-format weight="bold" :first-size="36" :subscript-size="26" :second-size="36"
										:price="distributionInfo.history_earnings" :color="colorConfig.primary" />
								</view>
							</view>
						</view> -->
					</view>
					<view class="my-promote-box m-t-20 bg-white">
						<view class="promote-title">我的推广</view>
						<view class="promote-content flex">
							<view class="promote-left flex-col col-center">
								<view class="promote-section-title">我的推广码</view>
								<view class="invite-code m-t-20" @tap="onCopy">{{userInfo.user.distribution_code || ''}}</view>
							</view>
							<view class="promote-divider"></view>
							<view class="promote-right flex-col col-center" @tap="goToUserFans">
								<view class="promote-section-title">总邀请人数</view>
								<view class="invite-count m-t-20">{{distributionInfo.fans || 0}}</view>
							</view>
						</view>
					</view>
					<view class="invite-personnel-box m-t-20 bg-white">
						<view class="invite-header flex row-between">
							<view class="invite-header-item flex row-center" @tap="goToUserFans">
								<text>邀请人员 {{distributionInfo.fans || 0}}人</text>
								<u-icon name="arrow-right" size="28rpx" color="#666"></u-icon>
							</view>
							<view class="invite-header-item flex row-center" @tap="goToCommissionDetails">
								<text>收益明细</text>
								<u-icon name="arrow-right" size="28rpx" color="#666"></u-icon>
							</view>
						</view>
						<view class="invite-level-section">
							<view class="level-item flex row-between" @tap="goToLevelFans('first')">
								<view class="level-left flex-col">
									<view class="level-count-row flex row-center">
										<text class="level-count">{{distributionInfo.first_fans || distributionInfo.first_level_count || 0}}人</text>
										<u-icon name="arrow-right" size="24rpx" color="#999"></u-icon>
									</view>
									<view class="level-label">一级</view>
								</view>
								<view class="level-divider"></view>
								<view class="level-right flex-col">
									<view class="revenue-item">
										<text class="revenue-label">总收益</text>
										<text class="revenue-value">¥{{distributionInfo.first_total_earnings || distributionInfo.first_level_total || 0}}</text>
									</view>
									<view class="revenue-item m-t-10">
										<text class="revenue-label">今日收益</text>
										<text class="revenue-value">¥{{distributionInfo.first_today_earnings || distributionInfo.first_level_today || 0}}</text>
									</view>
								</view>
							</view>
							<view class="section-divider"></view>
							<view class="level-item flex row-between" @tap="goToLevelFans('second')">
								<view class="level-left flex-col">
									<view class="level-count-row flex row-center">
										<text class="level-count">{{distributionInfo.second_fans || distributionInfo.second_level_count || 0}}人</text>
										<u-icon name="arrow-right" size="24rpx" color="#999"></u-icon>
									</view>
									<view class="level-label">二级</view>
								</view>
								<view class="level-divider"></view>
								<view class="level-right flex-col">
									<view class="revenue-item">
										<text class="revenue-label">总收益</text>
										<text class="revenue-value">¥{{distributionInfo.second_total_earnings || distributionInfo.second_level_total || 0}}</text>
									</view>
									<view class="revenue-item m-t-10">
										<text class="revenue-label">今日收益</text>
										<text class="revenue-value">¥{{distributionInfo.second_today_earnings || distributionInfo.second_level_today || 0}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- <view class="usual-tools-box bg-white m-t-20">
						<view class="usual-tools-header flex lg bold">
							常用工具
						</view>
						<view class="usual-content flex">
					
							<router-link class="usual-item" to="/bundle/pages/user_spread_order/user_spread_order">
								<view class="flex-col col-center">
									<image src="/bundle/static/icon_fenxiao.png" class="usual-item-img"></image>
									<view class="nr normal m-t-20" style="line-height: 40rpx">分销订单</view>
								</view>
							</router-link>
							<router-link class="usual-item" to="/bundle/pages/commission_details/commission_details">
								<view class="flex-col col-center">
									<image src="/bundle/static/icon_yongjin.png" class="usual-item-img"></image>
									<view class="nr normal m-t-20" style="line-height: 40rpx">佣金明细</view>
								</view>
							</router-link>
							<router-link class="usual-item" to="/bundle/pages/monthly_bill/monthly_bill">
								<view class="flex-col col-center">
									<image src="/bundle/static/icon_zhangdan.png" class="usual-item-img"></image>
									<view class="nr normal m-t-20" style="line-height: 40rpx">月度账单</view>
								</view>
							</router-link>
						</view>
					</view> -->
				</view>
			</view>
			<u-popup v-model="showPop" mode="center" closeable border-radius="30">
				<view class="inviteform-contain flex-col col-center">
					<view class="title xl">填写邀请人</view>
					<view class="input-row flex">
						<view style="width: 140rpx;">邀请码：</view>
						<u-input :clearable="false" v-model="inviteCode" placeholder="请输入邀请码" ></u-input>
					</view>
					<view class="btn bg-primary white flex row-center" @tap="bindSuperiorFun">确定</view>
				</view>
			</u-popup>
			<u-select v-model="showRegion" mode="mutil-column-auto" @confirm="regionChange" :list="regionLists">
			</u-select>
		</view>
	</view>

</template>

<script>
	import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
	import {
		bindSuperior,
		applyDistribute,
		applyDetail,
		getSuperiorInfo,
		getDistribution,
		veryfiyDistribute
	} from "@/api/user";
	import area from '@/utils/area'
	import {
		copy
	} from '@/utils/tools'
	export default {
		components: {
			CustomNavbar
		},
		data() {
			return {
				list: ['成为分销会员，推广下级可获得额外收益，推广越多收益越多'],
				showTips: true,
				showLoading: true,
				// 弹窗展示
				showPop: false,
				inviteCode: '',
				mobile: '',
				realName: '',
				reason: '',
				region: '',
				// 省id
				provinceId: -1,
				// 市id
				cityId: -1,
				// 区ID
				districtId: -1,
				// 推销状态 0 ==> 未申请 1 ==> 申请进度 2 ==> 已申请
				vipState: 0,
				userInfo: {
					user: {},
					leader: {}
				},
				// 审核信息对象
				applyObject: {},
				// 邀请人状态
				inviteStatus: false,
				showRegion: false,
				regionLists: area,
				distributionInfo: {}
			};
		},
		onLoad(options) {
			// 获取上级及个人信息
			this.getSuperiorInfoFun()
			// 判断是否是分销会员
			this.veryfiyDistributeFun()
		},


		methods: {
			// 分销会员信息
			async getDistributionFun() {
				const {
					data,
					code
				} = await getDistribution()
				if (code == 1) {
					this.showLoading = false
					this.distributionInfo = data
				}
			},

			veryfiyDistributeFun() {
				veryfiyDistribute().then(res => {
					if (res.code == 10001) {
						// 分销会员
						this.vipState = 2
						this.getDistributionFun()
					} else if (res.code == 20001) {
						// 非分销会员
						this.vipState = 0;
						this.applyDetailFun()
					} else if (res.code == 0) {
						// 返回上一页
						setTimeout(() => {
							uni.navigateBack()
						}, 500)
					}
				})
			},

			// 最新分销会员申请详情
			async applyDetailFun() {
				const {
					data,
					code
				} = await applyDetail()
				if (code == 1) {
					this.showLoading = false
					switch (data.status) {
						case 0:
							// 待审核
						case 2:
							// 审核不通过
							this.vipState = 1;
							this.applyObject = data
							break;
					}
				}
			},

			reApply() {
				this.vipState = 0
			},

			regionChange(region) {
				this.region = region[0].label + " " + region[1].label + " " + region[2].label
				this.provinceId = region[0].value;
				this.cityId = region[1].value;
				this.districtId = region[2].value
			},

			async formSubmit() {
				let {
					provinceId,
					cityId,
					districtId,
					reason,
					mobile,
					realName,
					region
				} = this;

				if (!realName) {
					this.$toast({
						title: "请填写真实姓名"
					});
					return;
				}

				if (!region.length) {
					this.$toast({
						title: "请选择省市区"
					});
					return;
				}

				let params = {
					real_name: realName,
					province: provinceId,
					city: cityId,
					district: districtId,
					reason: reason,
					mobile
				};
				const {
					data,
					code,
					msg
				} = await applyDistribute(params)
				if (code == 1) {
					this.$toast({
						title: msg
					});
					this.applyDetailFun();
				}
			},


			// 填写邀请码
			bindSuperiorFun() {
				bindSuperior({
					code: this.inviteCode
				}).then(res => {
					this.$toast({
						title: res.msg
					})
					if (res.code == 1) {
						this.showPop = false
						this.getSuperiorInfoFun();
					}
				});
			},

			showInvitePop() {
				this.showPop = true;
			},

			// 获取邀请人信息
			async getSuperiorInfoFun() {
				const {
					data,
					code
				} = await getSuperiorInfo()
				if (code == 1) {
					this.userInfo = data
				}
			},
			onCopy() {
				copy(this.userInfo.user.distribution_code)
			},

			goToUserFans() {
				uni.navigateTo({
					url: '/bundle/pages/user_fans/user_fans'
				})
			},

			goToCommissionDetails() {
				uni.navigateTo({
					url: '/bundle/pages/commission_details/commission_details'
				})
			},

			goToLevelFans(level) {
				uni.navigateTo({
					url: `/bundle/pages/user_fans/user_fans?level=${level}`
				})
			}

		}
	};
</script>
<style lang="scss">
	.user-spread {
		padding-top: calc(35rpx + var(--status-bar-height));
		background: linear-gradient(180deg, #189B07 10%, #B2DF14 23%,#F5F5F5 0%);

		.header {

			.user-info {
				.user-avatar {
					position: relative;

				
				}
				.avatar-tag {
					display: inline-block;
					background-color: #F79C0C;
					border: 1rpx solid #FFFFFF;
					border-radius: 100rpx;
					line-height: 32rpx;
					padding: 0 10rpx;
				}
				.user-message { 
					.write-btn {
						height: 42rpx;
						width: 100rpx;
						border: 2rpx solid #1B8902;
						color: #1B8902;
						background: #F0FFF8;
					}
				}
			}
		}

		.main {
			padding: 0 20rpx;

			.user-vip {
				.user-assets-box {
					background-color: #fff;
					border-radius: 20rpx;
					padding: 40rpx 30rpx 50rpx;
					background: #FFFFFF;

					.user-assets-header {
						.header-title-row {
							margin-bottom: 30rpx;
							
							.header-title {
								font-size: 36rpx;
								font-weight: 600;
								color: #333333;
								position: relative;
								padding-bottom: 8rpx;
								
								&::after {
									content: '';
									position: absolute;
									bottom: 0;
									left: 0;
									width: 140rpx;
									height: 8rpx;
									background: linear-gradient(90deg, #1D9D0A 0%, #ACFF00 85.84%);
									border-radius: 2rpx;
								}
							}
							
							.header-link {
								font-size: 32rpx;
								color: #000;
								display: flex;
								align-items: center;
								gap: 8rpx;
							}
						}
						
						.balance-display {
							margin-bottom: 30rpx;
						}

						.withdraw-btn {
							height: 88rpx;
							border-radius: 44rpx;
							width: 100%;
							background: linear-gradient(90deg, #189B07 0%, #B2DF14 100%);
							font-size: 32rpx;
							font-weight: 600;
						}
					}

					.user-assets-content {
						margin-top: 30rpx;

						.user-item {
							flex: 1;
							position: relative;

							.user-assets-name {
								text-align: left;
								align-self: flex-start;
							}

							.assets {
								margin-top: 14rpx;
								text-align: left;
								align-self: flex-start;
							}
						}
					}
				}

				.my-promote-box {
					border-radius: 20rpx;
					padding: 30rpx 30rpx 40rpx;
					
					.promote-title {
						font-size: 36rpx;
						font-weight: 600;
						color: #333333;
						margin-bottom: 30rpx;
					}
				}

				.invite-personnel-box {
					border-radius: 20rpx;
					padding: 30rpx;
					
					.invite-header {
						padding-bottom: 30rpx;
						border-bottom: 1rpx solid #E5E5E5;
						
						.invite-header-item {
							font-size: 32rpx;
							color: #333333;
							gap: 8rpx;
						}
					}
					
					.invite-level-section {
						padding-top: 30rpx;
						
						.level-item {
							padding: 20rpx 0;
							
							.level-left {
								flex: 1;
								display: flex;
								flex-direction: column;
								
								.level-count-row {
									gap: 8rpx;
									margin-bottom: 10rpx;
									display: flex;
									align-items: center;
									
									.level-count {
										font-size: 32rpx;
										color: #333333;
										font-weight: 500;
									}
								}
								
								.level-label {
									font-size: 24rpx;
									color: #999999;
									margin-top: 0;
									margin-left: 110rpx;
								}
							}
							
							.level-divider {
								width: 1rpx;
								height: 80rpx;
								background-color: #E5E5E5;
								margin: 0 30rpx;
							}
							
							.level-right {
								flex: 1;
								
								.revenue-item {
									display: flex;
									justify-content: space-between;
									align-items: center;
									
									.revenue-label {
										font-size: 28rpx;
										color: #666666;
									}
									
									.revenue-value {
										font-size: 32rpx;
										color: #333333;
										font-weight: 600;
									}
								}
							}
						}
						
						.section-divider {
							height: 1rpx;
							background-color: #E5E5E5;
							margin: 20rpx 0;
						}
					}
				}

				.my-promote-box {
					border-radius: 20rpx;
					padding: 30rpx 30rpx 40rpx;
					
					.promote-title {
						font-size: 36rpx;
						font-weight: 600;
						color: #333333;
						margin-bottom: 30rpx;
					}
					
					.promote-content {
						.promote-left,
						.promote-right {
							flex: 1;
							
							.promote-section-title {
								font-size: 28rpx;
								color: #666666;
							}
							
							.invite-code {
								font-size: 42rpx;
								font-weight: bold;
								color: #333333;
								word-break: break-all;
								text-align: center;
								cursor: pointer;
								user-select: none;
								-webkit-user-select: none;
							}
							
							.invite-count {
								font-size: 72rpx;
								font-weight: bold;
								color: #333333;
							}
						}
						
						.promote-divider {
							width: 1rpx;
							height: 200rpx;
							background-color: #E5E5E5;
							margin: 0 30rpx;
						}
					}
				}

				.usual-tools-box {
					border-radius: 10rpx;
					padding: 0 25rpx;

					.usual-tools-header {
						height: 100rpx;
						line-height: 44rpx;
						border-bottom: $-solid-border;
					}

					.usual-content {
						padding: 40rpx 0;

						.usual-item {
							width: 25%;

							.usual-item-img {
								width: 56rpx;
								height: 56rpx;
								flex: none;
							}

						}
					}
				}
			}

			.user-apply-box {
				.user-apply-vip {
					background-color: white;
					padding: 40rpx 0 0rpx;
					border-radius: 20rpx;

					.title {
						line-height: 30rpx;
						font-weight: bold;
					}

					.explain {
						margin-top: 20rpx;

						image {
							width: 24rpx;
							height: 24rpx;
							flex: none;
						}

						span {
							font-size: 20rpx;
							line-height: 30rpx;
						}
					}

					.vip-form {
						width: 100%;
						margin-top: 60rpx;

						.form-item {
							border: $-solid-border;
							margin: 0 30rpx 30rpx;
						}
					}
				}

				.apply-btn {
					line-height: 30rpx;
					height: 82rpx;
					background: linear-gradient(91.58deg, #49AB02 15.84%, #E4E872 83.36%, #EFFD6B 96.79%);
				}
			}

			.user-result-box {
				.user-result {
					background-color: white;
					padding: 36rpx 14rpx 50rpx;
					border-radius: 20rpx;

					.user-result-header {
						.title {
							line-height: 30rpx;
							font-weight: bold;
						}

					}
					.user-result-content {
						padding: 60rpx 0 22rpx;
						width: 100%;
						border-bottom: $-solid-border;

						.apply-result-img {
							width: 100rpx;
							height: 100rpx;
						}
					}

					.user-result-info {
						margin-top: 42rpx;
						width: 100%;

						.info-item {
							margin-left: 60rpx;
							margin-bottom: 28rpx;
							line-height: 30rpx;

							.label {
								width: 140rpx;
							}
						}
					}
				}

				.apply-btn {
					line-height: 30rpx;
					height: 82rpx;
					background: linear-gradient(91.58deg, #49AB02 15.84%, #E4E872 83.36%, #EFFD6B 96.79%);
				}

				.bg-gray {
					background-color: #CCCCCC;
				}
			}
		}
	}


	.main .user-apply-box .apply-btn {
		line-height: 30rpx;
		height: 82rpx;
	}

	.main .user-result-box .user-result-content .apply-fail-reason {
		color: $-color-primary;
		line-height: 36rpx;
		margin-top: 10rpx;
	}

	/* 弹窗 */
	.inviteform-contain {
		padding-left: 30rpx;
		padding-right: 30rpx;
		padding-bottom: 30rpx;
		width: 580rpx;
		border-radius: 6rpx;
		background-color: $-color-white;
	}

	.inviteform-contain .title {
		padding: 26rpx 0rpx;
	}

	.inviteform-contain .modify-row {
		padding: 32rpx 0px;
		width: 100%;
		border-bottom: 1rpx solid #E5E5E5;
	}

	.inviteform-contain .btn {
		height: 80rpx;
		padding: 0 180rpx;
		border-radius: 10rpx;
		margin-top: 60rpx;
		background: linear-gradient(91.58deg, #49AB02 15.84%, #E4E872 83.36%, #EFFD6B 96.79%);
	}

</style>
