$(function() {
    // 获取用户名称信息
    getUserinfo();
    // 点击退出按钮，实现退出功能
    var layer = layui.layer;
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 清除本地存储的token
            localStorage.removeItem('token');
            // 跳转到登录界面
            location.href = '/login.html';
            layer.close(index);
        })
    })
})

// 封装获取用户基本信息函数
function getUserinfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 设置headers请求头
        /* headers: {
            Authorization: localStorage.getItem('token') || ''
        }, */
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 渲染用户头像
            renderAvatar(res.data)
        },
        // 无论成功还是失败，最终都会调用complete函数
        /*  complete: function(res) {
             // 在complete回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
             if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                 // 强制清空token
                 localStorage.removeItem('token');
                 // 强制跳转到登录界面
                 location.href = '/login.html';
             }
         } */
    })
}

// 渲染用户头像函数
function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username;
    // 设置欢迎文本
    $('.welcome').html('欢迎&nbsp&nbsp' + name);
    // 按需渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide()
    } else {
        var first = name[0].toUpperCase();
        $('.layui-nav-img').hide();
        $('.text-avatar').html(first).show()
    }
}