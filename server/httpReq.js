
/*
	这里只针对Meteor的相关方法
	如果你使用Nodejs, 请更改下
	面的获取config.json的方法
*/
var crypto = Npm.require('crypto');
var config = JSON.parse(Assets.getText('config.json'));


function getFlags() {
	//对这个方法只做简单上传到bucket就好
	var returnObj = {
		scope: config.BUCKET_NAME,
		deadline: 3600 + Math.floor(Date.now() / 1000)		
	}
	return returnObj;
}

function urlsafeBase64Encode (jsonFlags) {
	var encoded = new Buffer(jsonFlags).toString('base64');
	return base64ToUrlSafe(encoded);
}

function base64ToUrlSafe (val) {
	return val.replace(/\//g, '_').replace(/\+/g, '-');
}

function hmacSha1 (encodedFlags, secretKey) {
	var hmac = crypto.createHmac('sha1', secretKey);
	return hmac.update(encodedFlags).digest('base64');
}

// module.exports = function() {
// 	var flags = getFlags();
// 	var encodedFlags = urlsafeBase64Encode(JSON.stringify(flags));
// 	var encoded = hmacSha1(encodedFlags, config.SECRET_KEY);
// 	var encodedSign = base64ToUrlSafe(encoded);
// 	var tokenInfo = {
// 		uptoken: config.ACCESS_KEY + ':' + encodedSign + ':' + encodedFlags
// 	}
// 	return tokenInfo;
// }
WebApp.connectHandlers.use('/cmeteor-token', function(req, res) {
	var flags = getFlags();
	var encodedFlags = urlsafeBase64Encode(JSON.stringify(flags));
	var encoded = hmacSha1(encodedFlags, config.SECRET_KEY);
	var encodedSign = base64ToUrlSafe(encoded);
	var tokenInfo = {
		uptoken: config.ACCESS_KEY + ':' + encodedSign + ':' + encodedFlags
	}
	res.writeHead(200, {
		'Content-Type':'text/json',
		'Expires': 0,
		'Pragma': 'no-cache'
	});
	res.end(JSON.stringify(tokenInfo));
});
