$(document).ready(function () {
    var $bd = $(document.body);

    // message
    var mdmessage = function (msg, top, callback) {
        top = top || -48;
        var delay = 400;
        var mlength = msg.length * 20 + 32 * 2;
        if (mlength > 400) {
            mlength = 400;
        }
        var pos = '';
        if (top > 0) {
            pos = 'top:' + top + 'px';
        } else {
            pos = 'bottom:' + (top * -1) + 'px';
        }
        var html = '';
        html += '<div class="md-buildin paper rounded z-depth-5 md-message" style="opacity: 0; width:' + mlength + '; ' + pos + ';">';
        html += '   <div class="md-buildin-content">' + msg + '</div>';
        html += '</div>';

        var $msg = $(html);
        $bd.append($msg);

        // 计算左右位置
        var wsize = $z.winsz();
        var mw = $msg.outerWidth();

        $msg.css('left', (wsize.width - mw) / 2);

        $msg.animate({
            opacity: 1,
        }, 'slow', function () {
            setTimeout(function () {
                $msg.animate({
                    opacity: 0,
                }, function () {
                    $msg.remove();
                    if (callback) {
                        callback();
                    }
                });
            }, delay);
        });
    };

    // alert
    var mdalert = function (msg) {
        // TODO 暂时用不上了
    };

    // confirm
    var mdconfirm = function (msg, title, callback) {
        var mlength = msg.length * 40 + 32 * 2;
        if (mlength < 300) {
            mlength = 300;
        }
        if (mlength > 400) {
            mlength = 400;
        }
        var html = '';
        html += '<div class="md-buildin-bg">';
        html += '   <div class="md-buildin paper rounded z-depth-5 md-confirm" style="opacity: 0; width:' + mlength + 'px;">';
        if (title) {
            html += '   <div class="md-buildin-title">' + title + '</div>';
        }
        html += '       <div class="md-buildin-content">' + msg + '</div>';
        html += '       <div class="md-buildin-btns">';
        html += '           <button class="md-button raised-button is-primary" val="false">';
        html += '               <span class="md-button-label">取消</span>';
        html += '           </button>';
        html += '           <button class="md-button raised-button is-secondary" val="true">';
        html += '               <span class="md-button-label">确认</span>';
        html += '           </button>';
        html += '       </div>';
        html += '   </div>';
        html += '</div>';

        var $confirmbg = $(html);
        $bd.append($confirmbg);
        var $confirm = $confirmbg.find('.md-confirm');
        // 计算左右位置
        var wsize = $z.winsz();
        var mw = $confirm.outerWidth();
        var mh = $confirm.outerHeight();

        $confirm.css({'left': (wsize.width - mw) / 2, 'top': (wsize.height - mh) / 2});
        $confirm.animate({
            opacity: 1,
        }, 'fast', function () {
            $confirm.delegate('button', 'click', function () {
                var isTrue = $(this).attr('val') == 'true';
                callback(isTrue);
                $confirmbg.animate({
                    opacity: 0,
                }, 'fast', function () {
                    $confirmbg.remove();
                });
            });
        });
    };

    // prompt
    var mdprompt = function (title, dftmsg, callback) {
        dftmsg = dftmsg || '';
        var mlength = 400;
        var html = '';
        html += '<div class="md-buildin-bg">';
        html += '   <div class="md-buildin paper rounded z-depth-5 md-prompt" style="opacity: 0; width:' + mlength + 'px;">';
        if (title) {
            html += '   <div class="md-buildin-title">' + title + '</div>';
        }
        html += '       <input class="md-buildin-input" type="text" value="' + dftmsg + '" />';
        html += '       <div class="md-buildin-btns">';
        html += '           <button class="md-button raised-button is-primary md-btn-cancel" val="false">';
        html += '               <span class="md-button-label">取消</span>';
        html += '           </button>';
        html += '           <button class="md-button raised-button is-secondary md-btn-ok" val="true">';
        html += '               <span class="md-button-label">确认</span>';
        html += '           </button>';
        html += '       </div>';
        html += '   </div>';
        html += '</div>';

        var $confirmbg = $(html);
        $bd.append($confirmbg);
        var $confirm = $confirmbg.find('.md-prompt');
        var $confinput = $confirmbg.find('.md-buildin-input');
        // 计算左右位置
        var wsize = $z.winsz();
        var mw = $confirm.outerWidth();
        var mh = $confirm.outerHeight();

        $confirm.css({'left': (wsize.width - mw) / 2, 'top': (wsize.height - mh) / 2});
        $confirm.animate({
            opacity: 1,
        }, 'fast', function () {
            $confinput.focus();
            $confirm.delegate('button', 'click', function () {
                var isTrue = $(this).attr('val') == 'true';
                var inval = $confinput.val().trim();
                if (isTrue) {
                    callback(inval);
                } else {
                    callback(null);
                }
                $confirmbg.animate({
                    opacity: 0,
                }, 'fast', function () {
                    $confirmbg.remove();
                });
            });
        });
    };

    // menu
    var mdmenu = function (mconf) {
        var e = mconf.e;
        var menu = mconf.menu;
        // m 来处理菜单样式
        var html = '';
        //html += '<div class="md-buildin-bg transparent" oncontextmenu="return false;">';
        //html += '<div class="md-buildin-bg transparent">';
        html += _mhtml(menu, 0);
        //html += '</div>';

        // e 来处理显示位置
        //var $menubg = $(html);
        //$bd.append($menubg);
        //var $menu = $menubg.find('.md-menu.lvl-0');
        var $menu = $(html);
        $bd.append($menu);
        // 计算位置
        if (e) {
            $menu.css({
                'top': e.clientY,
                'left': e.clientX
            });
            e.stopPropagation();
            e.preventDefault();
        }
        return $menu;
    };

    var _mhtml = function (menu, level) {
        var html = '<ul class="md-menu no-icon lvl-' + level + '" oncontextmenu="return false;">';
        for (var i = 0; i < menu.length; i++) {
            var m = menu[i];
            if (m.divider) {
                html += '<li class="divider"></li>';
            } else {
                html += '<li class="' + (m.action ? "has-action" : "") + " " + (m.menu ? "has-sub-menu" : "") + '" action="' + m.action + '">';
                html += '    <a  class="ripple-button" onclick="return false;">';
                if (m.icon) {
                    if (m.iconType == 'fa') {
                        html += '<i class="fa-icon ' + m.icon + '"></i>';
                    } else if (m.iconType == 'walnut') {
                        html += '<i class="walnut-icon ' + m.icon + '"></i>';
                    } else {
                        html += '<i class="md-icon ' + m.icon + '"></i>';
                    }
                }
                html += m.label;
                html += '    </a>';
                if (m.menu) {
                    html += _mhtml(m.menu, level + 1);
                }
                html += '</li>';
            }
        }
        html += '   </ul>';
        return html;
    };


    //var opt = {
    //    title: "",
    //    content: "",
    //    width: "",
    //    height: "",
    //    ok: function () {
    //    },
    //    cancel: function () {
    //    },
    //    btns: [{
    //        label: '',
    //        clz: '',
    //        callback: function ($win) {
    //        }
    //    }, {
    //        label: '',
    //        clz: '',
    //        callback: function ($win) {
    //        }
    //    }]
    //};


    var mdwin = {
        open: function (opt) {
            var html = '';
            html += '<div class="md-buildin-bg">';
            html += '   <div class="md-buildin paper rounded z-depth-5 md-win" style="opacity: 0; ">';
            if (opt.title) {
                html += '   <div class="md-buildin-title">' + opt.title + '</div>';
            }
            html += '       <div class="md-buildin-content">' + opt.content + '</div>';
            html += '       <div class="md-buildin-btns">';
            if (opt.btns) {
                for (var i = 0; i < opt.btns.length; i++) {
                    // TODO
                    var btn = opt.btns[i];
                    html += '           <button class="md-button raised-button ' + (btn.clz != null ? btn.clz : '') + '" index="' + i + '">';
                    html += '               <span class="md-button-label">' + btn.label + '</span>';
                    html += '           </button>';
                }
            }
            if (opt.cancel) {
                html += '           <button class="md-button raised-button is-primary md-btn-cancel">';
                html += '               <span class="md-button-label">取消</span>';
                html += '           </button>';
            }
            if (opt.ok) {
                html += '           <button class="md-button raised-button is-secondary md-btn-ok">';
                html += '               <span class="md-button-label">确认</span>';
                html += '           </button>';
            }
            html += '       </div>';
            html += '   </div>';
            html += '</div>';

            var $winbg = $(html);
            $bd.append($winbg);
            var $win = $winbg.find('.md-win');
            $win.css('width', opt.width);
            $win.css('height', opt.height);

            // 计算左右位置
            var wsize = $z.winsz();
            var mw = $win.outerWidth();
            var mh = $win.outerHeight();
            $win.css({'left': (wsize.width - mw) / 2, 'top': (wsize.height - mh) / 2});

            // 计算content的宽高
            var miw = $win.width();
            var mih = $win.height();
            var $title = $win.find('.md-buildin-title');
            var $content = $win.find('.md-buildin-content');
            var $btns = $win.find('.md-buildin-btns');

            $content.css("height", mih - $title.outerHeight() - $btns.outerHeight() - 32);

            $win.animate({
                opacity: 1
            }, 'fast', function () {

                if (opt.init) {
                    opt.init($win);
                }

                $win.delegate('button', 'click', function () {
                    var $btn = $(this);
                    var ok = $btn.hasClass('md-btn-ok');
                    var cancel = $btn.hasClass('md-btn-cancel');

                    // 确认callback
                    if (ok) {
                        mdwin.close(opt.ok);
                        return;
                    }
                    // 取消callback
                    if (cancel) {
                        mdwin.close(opt.cancel);
                        return;
                    }
                    // 自定义事件
                    opt.btns[parseInt($btn.attr('index'))].callback($win);
                });
            });
        },
        close: function (callback) {
            var $win = $bd.find('.md-win');
            var $winbg = $win.parent();
            if (callback) {
                if (callback($win) != false) {
                    $winbg.animate({
                        opacity: 0,
                    }, 'fast', function () {
                        $winbg.remove();
                    });
                }
            } else {
                $winbg.animate({
                    opacity: 0,
                }, 'fast', function () {
                    $winbg.remove();
                });
            }
        },
        curr: function () {
            return $bd.find('.md-win');
        }
    };


    window.$mp = window.$mp || {};
    window.$mp.message = mdmessage;
    window.$mp.confirm = mdconfirm;
    window.$mp.prompt = mdprompt;
    window.$mp.menu = mdmenu;
    window.$mp.win = mdwin;

});