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
  maxImgSize: '最大图片大小',  //option

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
    console.log(e);
  }

  ins.post(file, function(result) {
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

案例
====

我自己的基于`Ghost`的博客系统的前端上传图片
https://github.com/DgTechOrg/Customize-Ghost

**配置文件说明**

>  三个参数, 分别是: `BUCKET_NAME`,  `ACCESS_KEY`, `SECRET_KEY`
就是你定义的空间以及七牛提供给你的访问秘钥
