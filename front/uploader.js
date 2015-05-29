(function() {
	var STR_RAND = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
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
		this.domain = options.domain; //must
		this.url = options.tokenUrl; // must
		this.key = options.key || genRand();
		this.prefix = options.prefix || 'font-qn-uper/';
		this.timeout = options.timeout || 5000; // By default 5000ms
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

	upload.prototype._DefaultHeaders = function() {
		var headers = {
			'Authorization': this.token.uptoken
		}
		return headers;
	}

	upload.prototype.setHttpHeaders = function(extendHeaders) {
		var _resultHeaders = _.extend(this._DefaultHeaders(), extendHeaders);
		for(var i in _resultHeaders) {
			this._xhr.setRequestHeader(i, _resultHeaders[i]);
		}
	}

	upload.prototype._getToken = function() {
		var xhr = this.createAjax();
		self = this;
		xhr.open('GET', this.url, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				self.token = JSON.parse(xhr.responseText);
			}
		}
		xhr.send();
	}

	upload.prototype.post = function(file, cb) {
		this.file = file;
		var self = this;
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
		this._xhr.onload = function() {
			if (self._xhr.status === 200) {
				var returnObj = JSON.parse(self._xhr.responseText);
				returnObj.imageUrl = self.domain + '/' + returnObj.key;
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