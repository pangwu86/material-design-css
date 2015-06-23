$(document).ready(function () {

    var $bd = $(document.body);


    // 查找当前环境下的配置文件
    var hconf = $.extend(true, {}, (window._md_page_disk_ || {}));
    //
    var mpdisk = {
        startListen: function () {
            // 切换显示模式
            $bd.delegate('.md-disk .md-disk-header .md-menu li.grid-mode', 'click', function () {
                var $li = $(this);
                if ($li.hasClass('active')) {
                    return;
                } else {
                    $li.siblings().removeClass('active');
                    $li.addClass('active');
                    // 切换显示方式
                    var $mdb = $li.parents('.md-disk-container').find('.md-disk-body');
                    if ($li.hasClass('mode-grid')) {
                        $mdb.addClass('grid');
                    } else {
                        $mdb.removeClass('grid');
                    }
                }
            });

            // 切换排序
            $bd.delegate('.md-disk .md-disk-header .md-menu li.sort-mode', 'click', function () {
                var $li = $(this);
                if ($li.hasClass('active')) {
                    return;
                } else {
                    $li.siblings().removeClass('active');
                    $li.addClass('active');
                    var snm = $li.attr('sort');
                    // 查找到对应的排序对象
                    var $mgt = $li.parents('.md-disk-container').find('.md-disk-grid-title');
                    var $st = $mgt.find('.md-disk-gt-cell[sort=' + snm + ']');
                    if ($st.length > 0) {
                        $st.click();
                    }
                }
            });

            $bd.delegate('.md-disk .md-disk-container .md-disk-grid-title .md-disk-gt-cell', 'click', function () {
                var $st = $(this);
                var sort = $st.attr('sort');
                if (sort == undefined) {
                    return;
                }
                if ($st.hasClass('asc')) {
                    $st.addClass('desc').removeClass('asc');
                } else if ($st.hasClass('desc')) {
                    $st.addClass('asc').removeClass('desc');
                } else {
                    $st.siblings().removeClass('asc').removeClass('desc');
                    $st.addClass('asc');
                }
            });

            // 切换选中obj
            $bd.delegate('.md-disk .md-disk-container .md-disk-grid-item', 'mousedown', function (e) {
                var $gi = $(this);
                if (!$gi.hasClass('active')) {
                    $gi.siblings().removeClass('active');
                    $gi.addClass('active');
                }
                // 左键
                if (1 == e.which) {
                    // 就是选中
                }
                // 右键
                else if (3 == e.which) {
                    // 显示菜单
                }
            });
        }
    };
    mpdisk.startListen();

    window.$mp = window.$mp || {};
    window.$mp.disk = mpdisk;
});
