import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [{
			path: '/home',
			name: 'Home',
			component: Home,
			children: [{
					path: '/workbench',
					name: '工作台',
					component: () =>
						import('./views/workbench.vue')
				}, {
					path: '/scenic',
					name: '景区',
					component: () =>
						import('./views/scenic.vue')
				}, {
					path: '/commentator',
					name: '解说员收益管理',
					component: () =>
						import('./views/commentator.vue')
				}, {
					path: '/sellAdministrator',
					name: '景区收益管理',
					component: () =>
						import('./views/sellAdministrator.vue')
				}, {
					path: '/userAdministrator',
					name: '用户管理',
					component: () =>
						import('./views/userAdministrator.vue')
				}, {
					path: '/bannerAdministrator',
					name: 'banner管理',
					component: () =>
						import('./views/bannerAdministrator.vue')
				}, {
					path: '/searchAdministrator',
					name: '搜索管理',
					component: () =>
						import('./views/searchAdministrator.vue')
				}, {
					path: '/accountAdministrator',
					name: '账户管理',
					component: () =>
						import('./views/accountAdministrator.vue')
				}, {
					path: '/scenicSpot',
					name: '景点',
					component: () =>
						import('./views/scenicSpot.vue')
				},
				{
					path: '/classification',
					name: '景区分类标签管理',
					component: () =>
						import('./views/Newattractions/classification.vue')
				},
				{
					path: '/commentaryscenic',
					name: '解说内容管理',
					component: () =>
						import('./views/Newattractions/commentaryscenic.vue')
				},

				{
					path: '/newattractions',
					name: '添加景区',
					component: () =>
						import('./views/Newattractions/newattractions.vue')
				},
				{
					path: '/addedvoice',
					name: '增加语音',
					component: () =>
						import('./views/Classification/addedvoice.vue')
				},
				{
					path: '/salesData/:id',
					name: '销售数据',
					component: () =>
						import('./views/Classification/salesData.vue')
				},
				{
					path: '/voicesales/:id',
					name: '语音数据',
					component: () =>
						import('./views/Classification/voicesales.vue')
				},
				{
					path: '/addattractions',
					name: '添加景点',
					component: () =>
						import('./views/Classification/addattractions.vue')
				},
			]
		},
		{
			path: '/',
			name: '登录',
			component: () =>
				import('./views/Login.vue')
		},
	]
})