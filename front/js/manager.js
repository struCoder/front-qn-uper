(function() {
  var $fileBtn = $('#file-btn');
  var $show = $('#result-show');

  var options = {
    domain: 'http://7xjbiz.com1.z0.glb.clouddn.com',
    tokenUrl: '/token',
    prefix: 'temp/'
  }

  var ins = new frontQnUper(options);
  $('#upload').on('change', function() {
    ins.prefix = $('#prefix').val() || 'temp/';
    var file = this.files[0];
    //process
    ins.progress = function(total, loaded) {
      $fileBtn.val('上传进度: ' + (loaded / total).toFixed(0) * 100 + '%');
      if (loaded === total) {
        $fileBtn.val('请稍等...');
      }
    }
    ins.errHandle = function(e) {
      alert(e)
    }

    ins.post(file, function(result) {
      var resultDOM = [];

      for(var i in result) {
        resultDOM.push([
          '<div class="pic-url">',
          '<span>',
          result[i],
          '</span>',
          '</div>'
        ].join(''))
      }
      $show.append(resultDOM.join(''));
      setTimeout(function() {
        $fileBtn.val('上传图片');
      }, 1500);
    });
  })
})();
