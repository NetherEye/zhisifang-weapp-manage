/**
 * http配置
 */
// 引入axios
import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'
import router from '../../router.js'

var instance = axios.create(); // 防注入

var httpStack = [];
var loadingCount = 0;
var loading = null



// http请求拦截器
instance.interceptors.request.use(config => {
	
	if (!config.notQs) {
		config.method === 'post' || config.method === 'put' ? config.data = qs.stringify({ ...config.data
		}) : config.params = { ...config.params
		};
	}
	
	if(loadingCount === 0){
		loading = Vue.prototype.$Message.loading({
			duration: 0,
			content: 'Loading...'
		})
	}
	loadingCount++
	
	return config

}, error => {
	return Promise.reject(error)
})

// http响应拦截器
instance.interceptors.response.use(data => {
	data.config.httpId && unloadHttp(data.config.httpId)

	loadingCount--;
	if (loadingCount === 0) {
		loading()
	}
	
	if(data.data.code === 211){
		console.log(router.push({name: '其他地方登陆'}))
	}

	return data.data

}, error => {
	// 请求超时会在此捕获 
	// axios cancelToken 中断的请求也在此捕获axios.isCancel(error)

	loadingCount--;
	if (loadingCount === 0) {
		loading()
	}

	if (axios.isCancel(error)) {

		if (error.message === '中断上个路由所有请求并重置集合') {
			httpStack = []
		}

		// 手动中断请求
	} else {
		error.config.httpId && unloadHttp(error.config.httpId)
	}

	if (error.request.readyState == 4 && error.request.status == 0) {
		error.response = {
			code: 209,
			message: '请求超时'
		}

	} else {
		error.response = {
			code: error.response.status,
			message: '状态码' + error.response.status
		}
	}
	return error.response
})

class http {
	rq(obj) {
		return createHttp(obj)
	}
}

// 创建请求
function createHttp({
	url,
	method = 'get',
	cancelToken = axios.CancelToken.source(),
	data = {},
	timeout = 15000,
	notQs = false,
	httpId = createUnid(),
// 	onUploadProgress: function(progressEvent){ // 原生获取上传进度的事件
// 	    if(progressEvent.lengthComputable){
// 	        progressCallback(progressEvent);
// 	    }
// 	},
	onUploadProgress = () => {},
	headers = {
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	}
} = {}) {

	method = method.toLowerCase();

	loadHttp({
		url: url,
		method: method,
		cancelToken: cancelToken,
		httpId
	})

	return instance({
			url,
			method,
			cancelToken: cancelToken.token,
			[(method == 'put' || method == 'post' || method == 'patch') ? 'data' : 'params']: data,
			timeout,
			notQs,
			httpId,
			headers,
			onUploadProgress
		})
		.then(res => {
			return Promise.resolve(res)
		})
		.catch(err => {
			return Promise.resolve(err)
		})
}

Vue.prototype.$axios = axios

function loadHttp(obj) { // 装填请求
	httpStack.push(obj)
}

function unloadHttp(id) { // 卸载请求
	if (!id) {
		return
	}

	for (let i = 0, len = httpStack.length; i < len; i++) {
		if (httpStack[i].httpId === id) {
			httpStack.splice(i, 1)
			return
		}
	}
}

function createUnid() {
	let unid = 'xyxyxy'.replace(/[xy]/g, c => {
		return (c == 'x' ? String.fromCharCode(Math.floor(Math.random() * 8 + 49)) : String.fromCharCode(Math.floor(Math.random() *
			25 + 97)))
	});
	return unid
}

var $http = new http()
export {
	$http,
	httpStack
}
