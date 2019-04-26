import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		userInfo: null,
		activePathName: '',
		navigate: []
	},
	getters: {
		c_navigate: state => {
			return state.navigate
		}
	},
	mutations: {
		setUserInfo(state, obj) {
			state.userInfo = obj
		},
		setPathName(state, obj) {
			state.activePathName = obj.name
		},
		setNavigate(state, arr) {
			state.navigate = arr
		}
	},
	actions: {

	}
})
