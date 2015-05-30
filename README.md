小巧的前端七牛上传工具
----------------------

介绍
----
`不依赖任何第三方库`  


如何使用
---------
**客户端**
```javascript
var options = {
	//must
	domain: '七牛分配给你的域名', 

	//must
	tokenUrl: '你的服务器上获取uptoken的访问地址', 
	key: '对图片名字的自定义',  //option

	// option , 比如: 'font-qn-uper/'. 访问地址就是:http:domain/prefix/filename
	prefix: '自定义的路径',

	//option, 默认5000ms
	timeout: '请求超时时间' ,

	//option, 默认480px
	maxMobileWidth: '在手机上最大显示宽度',

	//option, 默认960px
	maxPcWidth: '在pc端最大显示宽度',

	//option, 格式比如: "jpg, png, jpeg"
	imageType: "文件类型"
}
var ins = new fontQnUper(options);
$('#upload').on('change', function() {
	var file = this.files[0];

	// 错误捕捉
	ins.errHandle = function(e) {
		console.log(e.msg, e);
	}

	ins.post(file, function(err, result) {
		if (err) {
			console.log(err)
		}
		/*result datas
			{
				hash: "", 
				key: "", 
				fullImageUrl: "完整的上传图片",
				mobileImageUrl:"手机上显示的图片",
				pcImageUrl:"pc端显示的图片"
			}
		*/
	});
	// 上传进度, total: 一共上传的数据, loaded: 已经上传的数据(bytes)
	ins.progress = function(total,loaded){
         //do something 
    }
});
```

**服务器**

**注意事项**
本人使用的是基于`Meteor`的服务端, 如果你换为Nodejs, 可以改一下配置
-  比如获取json文件的配置  
-  路由配置的修改

**配置文件说明**

>  三个参数, 分别是: `BUCKET_NAME`,	`ACCESS_KEY`, `SECRET_KEY`
就是你定义的空间以及七牛提供给你的访问秘钥