import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/iview.js'

import './assets/css/reset.css'
import './assets/css/public.css'
import './assets/css/style.less'

import moment from 'moment'
moment.locale('zh-cn'); 
Vue.prototype.$moment = moment

import $tools from './assets/tools/tools.js'
Vue.prototype.$tools = $tools

import $commonApi from './assets/api/common.js';
Vue.prototype.$commonApi = $commonApi



import {
	$http,
	httpStack
} from './assets/tools/http'
Vue.prototype.$http = $http

router.beforeEach((to, from, next) => {

	store.commit('setPathName', {
		name: to.name
	})

	if (httpStack.length !== 0) {
		httpStack.forEach((a, i) => {
			a.cancelToken.cancel('中断上个路由所有请求' + (i === (httpStack.length - 1) ? '并重置集合' : ''))
		})
	}

	if (to.name == '登录') {
		localStorage.clear()
		sessionStorage.clear()
		next()
		return
	}

	$http.rq({
		url: '/proxy/isLogin'
	}).then(res => {
		if (res.code === 200) {
			store.commit('setUserInfo', res.data)
			next()
			// 获取导航
			$http.rq({
				url: '/proxy/menu/navigate'
			}).then(res => {
				if (res.code === 200) {
					store.commit('setNavigate', res.data)
				} else {
					store.commit('setNavigate', [])
				}
			})

		} else {
			store.commit('setUserInfo', null)
			next({
				name: '登录'
			})
		}
	})



})

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')