// 每次调用$.get(),$.post(),$.ajax()的时候，会先调用ajaxPrefilter这个函数
// 在这个函数中可以拿到我们提供给Ajax的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
})