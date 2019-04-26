module.exports = {
	devServer: {
		proxy: {
			'/proxy': {
				target: 'http://172.16.4.248:8071',
				// target: 'https://bag.bftudou.com',
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/proxy': ''
				}
			}
		}
	}
};