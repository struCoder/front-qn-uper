(function() {
	var STR_RAND = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var DEFAULT_IMG = ['jpg', 'jpeg', 'gif', 'png', 'bmp'];
	var DEFAULT_SIZE = 10 * 1024;	// 10MB
	
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

	var createAjax = function() {
		var xmlhttp = {};
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.timeout = this.timeout;
		return xmlhttp;
	}

	var request = function(options, cb) {
		var self = this;
		var xhr = createAjax();
		xhr.open(options.method, options.url, true);
		xhr.onload = function() {
			if (xhr.status === 200) {
				try {
					var jsonResult = JSON.parse(xhr.responseText);
				} catch(e) {
					e.msg = 'parse text to json error';
					cb(e);
				}
				cb(null, jsonResult);
			}
		}

		xhr.ontimeout = function() {
			cb('timeout');
		}

		xhr.onerror = function(e) {
			e.msg = 'network error not frontQnUper self error';
			cb(e);
		}
		if (options.onProgress) {
			xhr.upload.onprogress = function(e) {
				self.progress(e.total, e.loaded);
			}
		}
		xhr.send(options.method === 'POST' ? options.data : null);
	}

	var qnUpload = function(options) {
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
		this.prefix = options.prefix || 'font-qn-uper/';
		this.timeout = options.timeout || 5000; // By default 5000ms
		this.maxMobileWidth = options.maxWidth || 480;
		this.maxPcWidth = options.maxPcWidth || 960;
		this.defaultSize = parseInt(options.maxImgSize, 10)  || 10 * 1024;
		this.uploadUrl = 'http://upload.qiniu.com/?token=';
		// this._getToken()
	}

	qnUpload.prototype.checkType = function(cb) {
		var errInfo;
		var fileName = this.file.name;
		var fileSize = this.file.size / 1024;
		var imgExt = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
		if (this.imageTypeArr.indexOf(imgExt) === -1) {
			errInfo = '图片格式为下面的一种:  ' + this.imageTypeArr.toString();
			cb(errInfo);
		} else if(fileSize > this.defaultSize) {
			errInfo = '图片大小因控制在'+ this.defaultSize + ' 内';
			cb(errInfo);
		} else {
			cb();
		}
	};

	qnUpload.prototype._getToken = function(cb) {
		var self = this;
		var options = {
			method: 'GET',
			url: this.url
		}
		if (typeof cb === 'function') {
			request(options, cb);
		} else {
			throw new Error('when get uptoken the cb must be Function');
		}
	}

	qnUpload.prototype._postPrepare = function(cb) {
		var self = this;
		this.checkType(function(err) {
			if (err && typeof self.errHandle === 'function') {
				return self.errHandle(err);
			}
			self._getToken(function(err, tokenInfo) {
				if (err && typeof self.errHandle === 'function') {
					return self.errHandle(e);
				}
				self.token = tokenInfo;
				if (typeof cb === 'function') {
					cb();
				}
			});
		});
	}

	qnUpload.prototype.post = function(file, cb) {
		this.file = file;
		var self = this;
		var randName = genRand();
		this._postPrepare(function() {
			var data = new FormData();
			data.append('file', file);
			data.append('key', self.prefix + randName);
			var postUrl = self.uploadUrl + self.token.uptoken + '&rand=' + Math.random(); // avoid cache
			var options = {
				method: 'POST',
				url: postUrl,
				onProgress: true,
				data: data
			}
			request.call(self, options, function(err, returnObj) {
				if (err && typeof errHandle === 'function') {
					return errHandle(err);
				}
				returnObj.fullImageUrl = self.domain + '/' + returnObj.key;
				returnObj.mobileImageUrl = self.domain + '/' + returnObj.key +'?imageView2/0/w/' + self.maxMobileWidth
				returnObj.pcImageUrl = self.domain + '/' + returnObj.key + '?imageView2/2/w/' + self.maxPcWidth;
				cb(returnObj);
			});
		});
	}
	window.frontQnUper = qnUpload;
})();