$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义一个查询的参数对象，用于请求数据时提交到服务器
    var q = {
        pagenum: 1, // 页码值,默认是1
        pagesize: 2, // 每页显示多少条数据,默认是2
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的状态
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initTable()
    initCate()

    // 获取文章列表的数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染文章列表数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // layer.msg('获取文章列表成功！')

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 获取文章分类下拉列表数据
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // 调用模板引擎渲染文章分类下拉列表
                var htmlStr = template('tpl-cate', res);
                $('[name="cate_id"]').html(htmlStr);
                // 通过layui重新渲染表单区域UI结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name="cate_id"]').val();
        var state = $('[name="state"]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()方法渲染分页结构
        laypage.render({
            elem: 'pageBox', // 分页容器的Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 5, 10],
            // 页面发送切换时候 触发jump回调
            jump: function(obj, first) {
                // 可以通过first的值来判断jump回调函数的触发方式，first值为true是调用laypage.render()方法时触发，若不为true则是点击分页页码按钮触发
                // 把最新的页码值赋值给查询参数对象q
                q.pagenum = obj.curr;
                // 把最新的条目数赋值给查询参数对象q
                q.pagesize = obj.limit;
                // 根据最新的q值获取数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过事件委托方式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // 获取页面上删除按钮的个数
        var num = $('.btn-delete').length;
        // 获取文章id
        var id = $(this).attr('data-id');
        // 弹出层询问用户是否要删除
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！');
                    // 当数据删除完成后 判断当前页面中是否还有剩余数据，如果没有 则让页码值-1之后再调用initTable()
                    if (num === 1) {
                        // 如果num的值等于1，说明删除完毕之后，说明页面上没有剩余数据了
                        // 页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })


})