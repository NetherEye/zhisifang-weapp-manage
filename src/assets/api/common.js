let url = '/proxy';

export default {
	getFileSign: url + '/oss/sign', // 获取上传签名
	account: url + '/account', // 7.获取全部账户信息
	accountpwd: url + '/account/pwd', // 修改密码
	narratorScenic: url + '/api/narratorScenic', // 解说列表
	narratorScenicHide: url + '/api/narratorScenic/isHide', // 修改是否隐藏
	allScList: url + '/api/scenicNopage', // 所有景区列表
	getPeople: url + '/account/role', // 获取某个角色所有用户
	getScBySclist: url + '/api/scenicSpotByScenicId', // 根据景区id获取景点列表
	addAudio: url + '/api/narratorScenic', // 添加解说
	addAudio: url + '/api/narratorScenic', // 添加解说
	delNarratorScenic: url + '/api/narratorScenic', // 删除解说员景区
	updateNarratorScenic: url + '/api/narratorScenic', // 修改解说员景区
	detailNarratorScenic: url + '/api/narratorScenic', // 解说语言详情
	getAllScList: url + '/api/scenicNopage', // 获取所有景区列表
	updateScAudio: url + '/api/narratorScenic/voice', // 修改语音内容
	startAcc: url + '/account/enable', // 启用账号
	endAcc: url + '/account/disable', // 禁用账号
	getRolePower: url + '/role', // 获取角色权限
	updateRolePower: url + '/role/assign', // 分配角色权限
	workBench: url + '/api/workbenchCount', // 控制台数量
	workBenchShell: url + '/api/workbenchSell', // 控制台条形

	userSearchListpage: url + '/api/userSearchListpage', // 分页获取用户搜索的搜索词
	searchListNopage: url + '/api/searchListNopage', // 无分页获取管理员设置的搜索词
	scenicSpot: url + '/api/scenicSpot', // 删除景点
	scenicNopage: url + '/api/scenicNopage', // 获取所有景区的列表
	scenicisHome: url + '/api/scenic/isHome', // 修改景区是否上推荐
	scenicisHide: url + '/api/scenic/isHide', // 修改景区是否显示
	scenicSpotisHide: url + '/api/scenicSpot/isHide', // 修改景区是否显示
	getAllSellPage: url + '/api/getAllSellPage', //1.37 分页获取总体的销售详情
	bannerList: url + '/api/bannerList', //1.1.2 banner列表
	banner: url + '/api/banner', //1.1.2 banner列表
	upBanner: url + '/api/upBanner', //1.1.2 banner列表
	getTypeSellPage: url + '/api/getTypeSellPage', //1.1.2 banner列表
	search: url + '/api/search', //1.1.2 banner列表
	addTag: url + '/api/tag', //1.17 获取标签列表
	addType: url + '/api/type', //1.21 获取类型列表
	scenic: url + '/api/scenic', //1.1 添加景区

	getscenicSellPage: url + '/api/getscenicSellPage', //1.39 分页获取景区的销售管理
	getscenicDetailsSellPage: url + '/api/getscenicDetailsSellPage', //1.40 分页获取景区销售详情
	getscenicgetNarratorSellPageSellPage: url + '/api/getNarratorSellPage', //1.41 分页获取解说员的销售管理
	getNarratorDetailsSellPage: url + '/api/getNarratorDetailsSellPage', //1.42 分页获取解说员销售详情
	sellCount: url + '/api/sellCount', //
	wxAccount: url + '/api/wxAccount/user', //1.2.1 用户列表

}