/* 
 工具函数
 */

class tools {
	getGUID() {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uuid;
	}

	/* js 精度丢失 */
	add(a, b) {
		var c, d, e;
		try {
			c = a.toString().split(".")[1].length;
		} catch (f) {
			c = 0;
		}
		try {
			d = b.toString().split(".")[1].length;
		} catch (f) {
			d = 0;
		}
		return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) + this.mul(b, e)) / e;
	}

	sub(a, b) {
		var c, d, e;
		try {
			c = a.toString().split(".")[1].length;
		} catch (f) {
			c = 0;
		}
		try {
			d = b.toString().split(".")[1].length;
		} catch (f) {
			d = 0;
		}
		return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
	}

	mul(a, b) {
		var c = 0,
			d = a.toString(),
			e = b.toString();
		try {
			c += d.split(".")[1].length;
		} catch (f) {}
		try {
			c += e.split(".")[1].length;
		} catch (f) {}
		return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
	}
	// 校验
	check(obj, noArr = []) {
		for (let att in obj) {
			if(noArr.indexOf(att) != -1){
				continue;
			}
			if (typeof obj[att] == 'string') {
				if (obj[att] === '') {
					console.log(att)
					return false
				}
			} else {
				if (obj[att] instanceof Array) {
					if (obj[att].length === 0) {
						return false
					} else {
						for (let i = 0, len = obj[att].length; i < len; i++) {
							if (this.check(obj[att][i])) {

							} else {
								console.log(att)
								return false
							}
						}
					}
				} else {
					if (this.check(obj[att])) {

					} else {
						console.log(att)
						return false
					}
				}
			}
		}
		return true
	}

	// 置空
	reset(obj) {
		for (let att in obj) {
			if (typeof obj[att] != 'object') {
				obj[att] = ''
			} else {
				if (obj[att] instanceof Array) {
					obj[att] = []
				} else {
					obj[att] = {}
				}
			}
		}
	}

}

export default new tools()