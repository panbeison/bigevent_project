$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArticleList();

    // 获取文章分类列表
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加分类按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['450px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的方式为form-add添加submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                initArticleList();
                layer.msg('新增文章分类成功！');
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的方式为btn-edit按钮添加点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类的弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['450px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的方式，为form-edit绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！')
                }
                layer.msg('更新分类信息成功！');
                layer.close(indexEdit);
                initArticleList()
            }
        })
    })

    // 通过代理的方式，为btn-delete按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        // 弹出询问框
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！');
                    layer.close(index);
                    initArticleList()

                }
            })

        });
    })
})