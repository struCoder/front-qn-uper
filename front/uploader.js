(function() {
	var STR_RAND = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var DEFAULT_IMG = ['jpg', 'jpeg', 'gif', 'png', 'bmp'];
	
	var genRand = function(len) {
		len = len || 16;
		var resultStr = '';
		var length = STR_RAND.length;
		var random = null;
		for (var i = 0; i < len; i++) {
			random = Math.floor(Math.random() * length);
			resultStr += STR_RAND.substring(random - 1, random);
		}
		return resultStr;
	}
	var upload = function(options) {
		if (Object.prototype.toString.call(options) !== '[object Object]') {
			throw new Error('options must be Object')
		}
		if (options.imageType) {
			this.imageTypeArr = options.imageType.split(',');
		} else {
			this.imageTypeArr = DEFAULT_IMG;
		}
		
		this.domain = options.domain; //must
		this.url = options.tokenUrl; // must
		this.key = options.key || genRand();
		this.prefix = options.prefix || 'font-qn-uper/';
		this.timeout = options.timeout || 5000; // By default 5000ms
		this.maxMobileWidth = options.maxWidth || 480;
		this.maxPcWidth = options.maxPcWidth || 960;
		this.uploadUrl = 'http://upload.qiniu.com/?token=';
		this._getToken();
	}

	upload.prototype.createAjax = function() {
		var xmlhttp = {};
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.timeout = this.timeout;
		return xmlhttp;
	}

	// upload.prototype._DefaultHeaders = function() {
	// 	var headers = {
	// 		'Authorization': this.token.uptoken
	// 	}
	// 	return headers;
	// }

	// upload.prototype.setHttpHeaders = function(extendHeaders) {
	// 	var _resultHeaders = _.extend(this._DefaultHeaders(), extendHeaders);
	// 	for(var i in _resultHeaders) {
	// 		this._xhr.setRequestHeader(i, _resultHeaders[i]);
	// 	}
	// }

	upload.prototype.checkType = function() {
		var fileName = this.file.name;
		var imgExt = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
		if (this.imageTypeArr.indexOf(imgExt) === -1) {
			return false;
		}
		return true;
	};

	upload.prototype._getToken = function() {
		var xhr = this.createAjax();
		var self = this;
		xhr.open('GET', this.url, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				try {
					self.token = JSON.parse(xhr.responseText);
				} catch (e) {
					e.msg = 'parse text to json error'
					if (typeof self.errHandle === 'function') {
						self.errHandle(e)
					}
				}
			}
		}

		xhr.onerror = function(e) {
			if (typeof self.errHandle === 'function') {
				e.msg = 'network error not fontQnUper self error';
				self.errHandle(e);
			}
		}
		xhr.send();
	}

	upload.prototype.post = function(file, cb) {
		this.file = file;
		var self = this;
		if (!this.checkType()) {
			var errInfo = '图片格式为下面的一种:  ' + this.imageTypeArr.toString();
			if (typeof this.errHandle === 'function') {
				return this.errHandle(errInfo);
			}
			return cb(errInfo);
		}
		if (!this._xhr) {
			this._xhr = this.createAjax();
		}
		if (!this.token.uptoken) {
			this._getToken();
		}
		var data = new FormData();
		data.append('file', file);
		data.append('key', this.prefix + this.key);

		var postUrl = this.uploadUrl + this.token.uptoken;
		this._xhr.open('POST', postUrl, true);
		this._xhr.ontimeout = function() {
			return cb('timeout');
		}
		this._xhr.upload.onprogress = function(e) {
			if (typeof self.progress === 'function') {
				self.progress(e.total, e.loaded)
			}
		}
		this._xhr.onerror = function(e) {
			if (typeof self.errHandle === 'function') {
				e.msg = 'network error not fontQnUper self error';
				self.errHandle(e);
			}
		}
		this._xhr.onload = function() {
			if (self._xhr.status === 200) {
				try {
					var returnObj = JSON.parse(self._xhr.responseText);
				} catch (e) {
					e.msg = 'parse text to json error'
					if (typeof self.errHandle === 'function') {
						self.errHandle(e)
					}
				}				
				returnObj.fullImageUrl = self.domain + '/' + returnObj.key;
				returnObj.mobileImageUrl = self.domain + '/' + returnObj.key +'?imageView2/0/w/' + self.maxMobileWidth
				returnObj.pcImageUrl = self.domain + '/' + returnObj.key + '?imageView2/2/w/' + self.maxPcWidth;
				return cb(null, returnObj);
			}
			if (self._xhr.status >= 400) {
				return cb('error code: ' + self._xhr.status);
			}
		}
		this._xhr.send(data);
	}

	window.fontQnUper = upload;
})();