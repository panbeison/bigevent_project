$(function() {
    // 切换注册界面
    $('#link-reg').on('click', function() {
        $('.reg-box').show();
        $('.login-box').hide()
    })

    // 切换登录界面
    $('#link-login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide()
    })

    // 从layui中获取form元素
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify()函数自定义检验规则
    form.verify({
        // 自定义pwd校验的规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 自定义校验两次密码是否一致的规则
        repwd: function(value) {
            var pwd = $('.reg-box [name="password"]').val();
            if (value !== pwd) {
                return '两次密码不一致'
            }
        }
    })

    // 给注册表单添加监听事件
    $('#form_reg').on('submit', function(e) {
        // 取消表单默认提交行为
        e.preventDefault();
        // 发起Ajax的POST请求
        var data = {
            username: $('#form_reg [name="username"]').val(),
            password: $('#form_reg [name="password"]').val()
        };
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg(res.message, function() {
                // 自动跳转到登录界面
                $('#link-login').click()
            })
        })
    })

    // 给登录表单添加监听事件
    $('#form_login').on('submit', function(e) {
        // 阻止表单默认行为
        e.preventDefault();
        // 发起Ajax请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')

                }
                layer.msg('登录成功！');
                // 将登录成功服务器返回的token字符串存储到localStorage中
                localStorage.setItem('token', res.token);
                // 跳转到后台首主页
                location.href = '/index.html'
            }
        })
    })
})