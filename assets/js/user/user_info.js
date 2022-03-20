$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    initUserInfo();

    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // 调用form.val()函数为表单快速赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 监听表单submit事件，修改用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！');
                // 调用父窗口index.html的获取用户基本信息函数
                window.parent.getUserinfo()
            }
        })
    })

    // 重置表单的数据
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo()
    })
})