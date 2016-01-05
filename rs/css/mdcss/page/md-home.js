$(document).ready(function () {

    // 查找当前环境下的配置文件
    var hconf = $.extend(true, {
        // 用户信息
        profile: {
            noprofile: false,
            name: null,
            email: null,
            avater: null // 这里给个img的url即可
        },
        // 页面设置
        page_setting: {
            title: '',
            page_dft: "/",
            page_rs: "/page"
        },
        nav_user: [],
        nav_main: [],
        ext_tabs: [],
        actions: {
            'signout': function () {
                // 退出系统
                setTimeout(function () {
                    window.location.href = "/u/do/logout";
                }, 1500);
            }
        },
        onready: function () {
        },
        closeQuick: false
    }, window._md_page_home_ || {});


    var mphome = {
        components: {
            'header': $('#md-page-header'),
            'pageTitle': $('#md-page-title'),
            'modulelabel': $('#module-label'),
            'modulelabelFront': $('#module-label > .front'),
            'modulelabelBack': $('#module-label > .back'),
            'info': $('.mp-info'),
            'nav': $('#md-page-nav'),
            'navBtnGroup': $('#md-page-header .nav-btn-group'),
            'navSwitch': $('.nav-switch'),
            'profile': $('#md-page-nav .user-profile'),
            'userMenu': $('#user-menu'),
            'mainMenu': $('#main-menu'),
            'userMenuSwitch': $('.user-menu-switch'),
            'main': $('#md-page-main'),
            'mainOverlay': $('#md-page-main-overlay'),
            'extSwtich': $('#md-page-header .ext-switch'),
            'extSwtichOff': $('#ext-tab-group .ext-switch'),
            'extBtnGroup': $('#md-page-header .ext-btn-group'),
            'extTabGroup': $('#ext-tab-group'),
            'extTabGroupBBar': $('#ext-tab-group .tab-bottom-bar'),
            'extTabContainerGroup': $('#ext-tab-container-group'),
            'extTabViewpage': $('#ext-tab-container-group .ext-tab-container-group-viewpage'),
            'ext': $('#md-page-extension'),
            'extOverlay': $('#md-page-extension-overlay'),
            'extOverlayLoading': $('#md-page-extension-overlay-loading'),
            'sysLoading': $('#md-system-loading'),
            'sysLoadingTip': $('#md-system-loading-tip'),
            'sysLoadingTipLabel': $('#md-system-loading-tip .tip-label'),
            'mainFab': $('#md-floating-action-button')
        },
        cons: {
            'liHeight': 48
        },
        setUlHeight: function ($ul) {
            var lisize = $ul.children('li').length;
            $ul[0].style.height = lisize * mphome.cons.liHeight + 'px';
        },
        clearUlHeight: function ($ul) {
            $ul[0].style.height = 0;
        },
        urlArgs: function (query) {
            var args = {};
            var pairs = query.split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pos = pairs[i].indexOf('=');
                if (pos == -1) {
                    continue;
                }
                var name = pairs[i].substr(0, pos);
                var value = pairs[i].substr(pos + 1);
                value = decodeURIComponent(value);
                args[name] = value;
            }
            return args;
        },
        cache: {
            url: {}
        },
        action: {},
        loadPage: function (useIframe, url, args) {
            mphome.nav.loadMainContainer(useIframe, url, args);
        }
    };


    mphome.signout = function (call) {
        // 停止其他操作
        mphome.sysLoading.open('正在退出系统...');
        // 关闭main
        mphome.components.main.empty();
        call();
    }

    // TODO 暂时放这里
    if (hconf.page_setting.title) {
        mphome.components.pageTitle.html(hconf.page_setting.title);
    }

    // 加载profile信息
    mphome.profile = {
        'load': function (callback) {
            if (mphome.components.profile.length > 0) {
                if ($.isFunction(hconf.profile)) {
                    hconf.profile(function (re) {
                        mphome.profile.set(re);
                        if (callback) {
                            callback()
                        }
                    });
                } else {
                    mphome.profile.set(hconf.profile);
                    if (callback) {
                        callback()
                    }
                }
            } else {
                if (callback) {
                    callback()
                }
            }
        },
        'set': function (profile) {
            if (profile.noprofile) {
                mphome.components.profile.hide();
            } else {
                if (profile.name) {
                    mphome.components.profile.find('.user-name').html(profile.name);
                }
                if (profile.email) {
                    mphome.components.profile.find('.user-email').html(profile.email);
                }
                if (profile.avater) {
                    mphome.components.profile.find('.user-avater').css('background-image', 'url("' + profile.avater + '")');
                }
            }
        }
    }

    mphome.mainOverlay = {
        'open': function () {
            mphome.components.mainOverlay.addClass('show');
            mphome.components.mainOverlay.addClass('open');
        },
        'close': function () {
            mphome.components.mainOverlay.removeClass('open');
            setTimeout(function () {
                if (!mphome.components.mainOverlay.hasClass('open')) {
                    mphome.components.mainOverlay.removeClass('show');
                }
            }, 500);
        }
    };

    mphome.ajaxloading = {
        'open': function () {
            mphome.components.header.addClass('ajaxloading');
        },
        'close': function () {
            mphome.components.header.removeClass('ajaxloading');
        },
        'enable': function () {
            $(document).ajaxStart(function () {
                mphome.ajaxloading.open();
            }).ajaxStop(function () {
                setTimeout(function () {
                    mphome.ajaxloading.close();
                }, 1000);
            })
        }
    };

    mphome.header = {
        'asHeader': function () {
            mphome.components.header.removeClass('notHeader');
        },
        'notHeader': function () {
            mphome.components.header.addClass('notHeader');
        }
    }

    mphome.module = {
        'showLabel': function (ltxt) {
            var lbnm = mphome.components.modulelabel.attr('labelBlock');
            var isFront = lbnm == 'front';
            var $lb = isFront ? mphome.components.modulelabelFront : mphome.components.modulelabelBack;
            $lb.html(ltxt);
            mphome.components.modulelabel.attr('labelblock', (isFront ? 'back' : 'front'));

            // 切换动画
            var $back = isFront ? mphome.components.modulelabelFront : mphome.components.modulelabelBack;
            var $front = isFront ? mphome.components.modulelabelBack : mphome.components.modulelabelFront;
            $front.removeClass('flipInX').addClass('flipOutX');
            setTimeout(function () {
                mphome.components.modulelabel.toggleClass('flip');
                $back.removeClass('flipOutX').addClass('flipInX');
            }, 500);
        }
    }

    mphome.user = {
        'loadInfo': function (callback) {
            mphome.profile.load(callback);
        }
    };

    mphome.ext = {
        'open': function () {
            mphome.components.ext.show();
            setTimeout(function () {
                mphome.mainOverlay.open();
                mphome.components.extSwtich.addClass('open');
                mphome.components.extSwtichOff.addClass('open');
                mphome.nav.close();
                // 当前显示的tab获得焦点 FIXME 暂时直接找到input进行focus
                mphome.components.extTabViewpage.find('.ext-tab-container.active input').focus();
                setTimeout(function () {
                    mphome.components.ext.addClass('open');
                }, 10)
            }, 10);
        },
        'close': function () {
            if (mphome.components.extSwtich.hasClass('open')) {
                mphome.components.extSwtich.removeClass('open');
                mphome.components.extSwtichOff.removeClass('open');
                mphome.components.ext.removeClass('open');
                setTimeout(function () {
                    mphome.components.ext.hide();
                }, 1000)
                mphome.mainOverlay.close();
            }
        },
        'makeExtBtnHtml': function (tabs) {
            var ebhtml = '';
            for (var i = 0, ml = tabs.length; i < ml; i++) {
                var tab = tabs[i];
                ebhtml += '<li class="md-icon-wrap ext-btn-icon" ext="' + tab.ext + '">';
                if (tab.icon) {
                    if (tab.iconType == 'fa') {
                        ebhtml += '<i class="fa-icon ' + tab.icon + '"></i>';
                    } else if (tab.iconType == 'walnut') {
                        ebhtml += '<i class="walnut-icon ' + tab.icon + '"></i>';
                    } else {
                        ebhtml += '<i class="md-icon ' + tab.icon + '"></i>';
                    }
                }
                ebhtml += '</li>';
            }
            return ebhtml;
        },
        'makeTabHtml': function (tabs) {
            var ebhtml = '';
            for (var i = 0, ml = tabs.length; i < ml; i++) {
                var tab = tabs[i];
                ebhtml += '<li class="ext-tab-label" ext="' + tab.ext + '">';
                ebhtml += '<div class="ripple-button">';
                ebhtml += tab.label;
                ebhtml += '</div>';
                ebhtml += '</li>';
            }
            return ebhtml;
        },
        'makeTabContainerHtml': function ($container, tabs) {
            for (var i = 0, ml = tabs.length; i < ml; i++) {
                var tab = tabs[i];
                mphome.ext._tabContainerHtml(tab, i, function (html) {
                    // $container[0].innerHtml = html;
                    $container.append(html);
                });
            }
        },
        '_tabContainerHtml': function (navItem, index, call) {
            var url = navItem.url;
            var page = hconf.page_setting.page_dft;
            var args = null;
            var isEssApp = !(url[0] == '/');   // 不是以 '/' 开头, 则为app名称
            // ess的app, 格式为app/id:xxxxx
            if (isEssApp) {
                // TODO
                var si = url.indexOf('/');
                var appname = null;
                var obj = null;
                if (si != -1) {
                    appname = url.substr(0, si);
                    // 获取obj对象
                    var objId = url.substr(si + 1);
                    obj = $http.syncGet("/o/get/" + objId).data;
                } else {
                    appname = url;
                }
                args = {};
                args.appname = appname;
                args.obj = obj;
            }
            // 普通页面,  格式为/xxx/xxxx?a=b&c=d
            else {
                page = url;
                if (navItem.args) {
                    url += "?" + navItem.args;
                    args = mphome.urlArgs(navItem.args);
                }

            }
            page = hconf.page_setting.page_rs + page;
            var html = "";
            html += '<div class="ext-tab-container ' + (index == 0 ? 'active' : '') + '" ext="' + navItem.ext + '" >'
            // 独立页面
            if (navItem.page) {
                html += '<iframe src="' + page + '"></iframe>';
                html += '</div>'
                call(html);
            }
            // 代码片段
            else {
                $http.getText(page, function (pg) {
                    // 内嵌的部分
                    html += pg;
                    html += '<script>';
                    html += '$(document).ready(function(){'
                    html += '    myInit(' + (args == null ? '' : JSON.stringify(args)) + ');';
                    html += '});'
                    html += '<' + '/script>';
                    html += '</div>'
                    call(html);
                });
            }
        },
        'loadTab': function (callback) {
            var tabs = hconf.ext_tabs;
            // 加载tab-btn
            mphome.components.extBtnGroup.append(mphome.ext.makeExtBtnHtml(tabs));
            // 加载tab
            mphome.components.extTabGroup.append(mphome.ext.makeTabHtml(tabs));
            // 加载tab-container
            mphome.ext.makeTabContainerHtml(mphome.components.extTabViewpage, tabs);
            //mphome.components.extTabViewpage.css(
            //    'width', tabs.length + "00%"
            //);
            // 计算Tab每个块的宽度
            // 这里因为有padding-left 48px;
            var tleft = parseInt($("#ext-tab-group").css('padding-left'));
            mphome.components.extTabGroup.find('li').each(function (i, ele) {
                var $li = $(ele);
                var tw = ele.offsetWidth;
                $li.attr('tleft', tleft);
                $li.attr('twidth', tw);
                tleft += tw;
            });

            if (callback) {
                callback();
            }
        }
    }

    mphome.nav = {
        'open': function () {
            mphome.mainOverlay.open();
            mphome.components.navSwitch.addClass('open');
            mphome.components.nav.addClass('open');

        },
        'close': function () {
            if (mphome.components.navSwitch.hasClass('open')) {
                mphome.components.navSwitch.removeClass('open');
                mphome.components.nav.removeClass('open');
                mphome.mainOverlay.close();
            }
        },
        'makeNavHtml': function (mc) {
            var navhtml = '';
            for (var i = 0; i < mc.length; i++) {
                var ni = mc[i];
                navhtml += '<li class="' + (ni.type == 'menu' ? 'has-sub-menu' : '') + '">';
                navhtml += '    <a  class="ripple-button" onclick="return false;" type="' + ni.type + '" label="' + ni.label + '"';
                // 类型
                if (ni.type == 'url') {
                    navhtml += ' url="' + ni.url + '" ';
                    if (ni.args) {
                        navhtml += ' args="' + ni.args + '"';
                    }
                } else if (ni.type == 'action') {
                    navhtml += ' action="' + ni.action + '"';
                }
                // 是否是独立页面
                if (ni.page) {
                    navhtml += ' page="true" ';
                } else {
                    navhtml += ' page="false" ';
                }
                navhtml += ' >';
                // 图标
                if (ni.icon) {
                    if (ni.iconType == 'fa') {
                        navhtml += '<i class="stato2-nav-icon fa-icon ' + ni.icon + '"></i>';
                    } else if (ni.iconType == 'walnut') {
                        navhtml += '<i class="stato2-nav-icon walnut-icon ' + ni.icon + '"></i>';
                    } else {
                        navhtml += '<i class="stato2-nav-icon md-icon ' + ni.icon + '"></i>';
                    }
                } else if (ni.img) {
                    navhtml += '<img src="' + ni.img + '" >';
                }
                navhtml += ni.label;
                navhtml += '    </a>';
                // 如果有子菜单
                if (ni.type == 'menu') {
                    navhtml += '<ul class="sub-menu">';
                    navhtml += mphome.nav.makeNavHtml(ni.menu);
                    navhtml += '</ul>';
                }
                navhtml += '</li>';
            }
            return navhtml;
        },
        'loadMenu': function (callback) {
            mphome.nav.loadUserMenu(callback);
        },
        'loadUserMenu': function (callback) {
            if ($.isFunction(hconf.nav_user)) {
                return hconf.nav_user(function (re) {
                    mphome.components.userMenu.append(mphome.nav.makeNavHtml(re));
                    mphome.nav.loadMainMenu(callback);
                });
            } else {
                mphome.components.userMenu.append(mphome.nav.makeNavHtml(hconf.nav_user));
                mphome.nav.loadMainMenu(callback);
            }
        },
        'loadMainMenu': function (callback) {
            if ($.isFunction(hconf.nav_main)) {
                return hconf.nav_main(function (re) {
                    mphome.components.mainMenu.append(mphome.nav.makeNavHtml(re));
                    if (callback) {
                        callback();
                    }
                });
            } else {
                mphome.components.mainMenu.append(mphome.nav.makeNavHtml(hconf.nav_main));
                if (callback) {
                    callback();
                }
            }
        },
        'navAction': function ($a) {
            var acNm = $a.attr('action');
            var acFun = mphome.action[acNm];
            if (acFun) {
                acFun();
            } else {
                alert("未注册事件: " + acNm);
            }
        },
        'navUrl': function (navItem) {
            // TODO 这里参杂着walnut的相关代码, 等着需要抽离出来
            // 加载页面
            var url = navItem.url;
            var lochref = window.location.href;
            var lhi = lochref.indexOf("#");
            var page = hconf.page_setting.page_dft;
            var args = null;

            // 清空当前页面
            mphome.components.main.empty();
            // 显示加载动画

            var isEssApp = !(url[0] == '/');   // 不是以 '/' 开头, 则为app名称
            if (isEssApp) {
                // TODO 暂时这样搞, 后面再开放接口
                page = "/a/open/" + url;
                if (navItem.args) {
                    url += navItem.args;
                    page += navItem.args;
                }
            }
            // 普通页面,  格式为/xxx/xxxx?a=b&c=d
            else {
                page = hconf.page_setting.page_rs + url;
                if (navItem.args) {
                    url += "?" + navItem.args;
                    args = mphome.urlArgs(navItem.args);
                }

            }
            // 显示module-label
            mphome.module.showLabel(navItem.label);
            // 设置新的href
            window.location.href = (lhi > 0 ? lochref.substr(0, lhi) : lochref) + "#" + url;

            mphome.nav.loadMainContainer(navItem.page, page, args);

            // 关闭nav
            setTimeout(function () {
                mphome.nav.close();
            }, 400);
        },
        loadMainContainer: function (sp, page, args) {

            if (window.myDestroy != undefined) {
                try {
                    // 先释放
                    myDestroy();
                    myDestroy = null;
                } catch (e) {
                    console.error("err: " + e);
                }
            } else {
                if (window.dftDestroy) {
                    try {
                        // 先释放
                        dftDestroy();
                    } catch (e) {
                        console.error("err: " + e);
                    }
                }
            }

            mphome.components.main.empty();
            mphome.header.asHeader();

            // 再加载与初始化

            var html = "";
            // 独立页面
            if (sp == "true") {
                html += '<iframe src="' + page + '"></iframe>';
                mphome.components.main.html(html);
            }
            // 代码片段
            else {
                $http.getText(page, function (pg) {
                    // 内嵌的部分
                    html += pg;
                    html += '<script>';
                    html += '$(document).ready(function(){'
                    html += '    myInit(' + (args == null ? '' : JSON.stringify(args)) + ');';
                    html += '});'
                    html += '<' + '/script>';
                    // 添加页面到mview中
                    // FIXME innerHtml 不会触发事件! 不会加载js文件
                    // mphome.components.main[0].innerHTML = html;
                    mphome.components.main.html(html);
                });
            }
        }
    };

    mphome.userMenu = {
        'open': function () {
            mphome.components.userMenuSwitch.addClass('open');
            mphome.components.userMenu.addClass('open');
            mphome.setUlHeight(mphome.components.userMenu);
        },
        'close': function () {
            mphome.components.userMenuSwitch.removeClass('open');
            mphome.components.userMenu.removeClass('open');
            mphome.clearUlHeight(mphome.components.userMenu);
        }
    };

    mphome.sysTip = {
        'tip': function (tip) {
            mphome.components.sysLoadingTipLabel[0].innerHTML = tip;
        },
        'open': function (tip) {
            mphome.components.sysLoadingTip.find('.tip-label').html(tip);
            mphome.components.sysLoadingTip.removeClass('close');
        },
        'close': function () {
            mphome.components.sysLoadingTip.addClass('close');
        }
    }

    mphome.sysLoading = {
        'open': function (tip) {
            mphome.components.sysLoading.removeClass('close');
            mphome.sysTip.open(tip);
        },
        'close': function () {
            setTimeout(function () {
                mphome.sysTip.close();
                setTimeout(function () {
                    mphome.components.sysLoading.addClass('close');
                }, 500);
            }, 1000);
        },
        'closeQuick': function () {
            mphome.sysTip.close();
            mphome.components.sysLoading.addClass('close');
        }
    }

    mphome.startListen = function () {

        mphome.components.navSwitch.on('click', function () {
            if ($(this).hasClass('open')) {
                mphome.nav.close();
            } else {
                mphome.nav.open();
            }
        });

        mphome.components.extSwtich.on('click', function () {
            if ($(this).hasClass('open')) {
                mphome.ext.close();
            } else {
                mphome.ext.open();
            }
        });

        mphome.components.extSwtichOff.on('click', function () {
            if ($(this).hasClass('open')) {
                mphome.ext.close();
            } else {
                mphome.ext.open();
            }
        });

        mphome.components.userMenuSwitch.on('click', function () {
            if ($(this).hasClass('open')) {
                mphome.userMenu.close();
            } else {
                mphome.userMenu.open();
            }
        });

        mphome.components.mainOverlay.on('click', function () {
            mphome.nav.close();
        });

        // 显示/关闭子菜单
        mphome.components.nav.delegate('li.has-sub-menu > a', 'click', function (e) {
            var $li = $(this).parent();
            if ($li.hasClass('open')) {
                $li.removeClass('open');
                mphome.clearUlHeight($li.children('ul'));
            } else {
                $li.addClass('open');
                mphome.setUlHeight($li.children('ul'));
                // 其他打开的关闭掉
                var $siblings = $li.siblings('.has-sub-menu.open');
                if ($siblings.length > 0) {
                    $siblings.removeClass('open');
                    mphome.clearUlHeight($siblings.children('ul'));
                }
            }
        });

        // 响应菜单项
        mphome.components.nav.delegate('li:not(.has-sub-menu) > a', 'click', function (e) {
            var $a = $(this);
            var $li = $a.parent();
            if ($li.hasClass('active')) {
                return;
            }
            // 查看类型
            var type = $a.attr('type');
            if (type == 'action') {
                mphome.nav.navAction($a);
                return;
            }
            else if (type == 'url') {
                mphome.nav.navUrl({
                    'url': $a.attr('url'),
                    'label': $a.attr('label'),
                    'args': $a.attr('args'),
                    'page': $a.attr('page')
                });
            } else if (type == 'menu') {
                // 不应走到这里的
            } else {
                // TODO 还没实现其他
            }
            // 修改样式
            mphome.components.nav.find('li.active').removeClass('active');
            $li.addClass('active');

        });

        // 响应tab
        mphome.components.extTabGroup.delegate('li', 'click', function (e) {
            // 计算距离左边的left, 还有当前块的宽度
            var $li = $(this);
            if ($li.hasClass('active')) {
                return;
            }
            $li.siblings().removeClass('active');
            $li.addClass('active');
            mphome.components.extTabGroupBBar.css({
                'width': $li.attr('twidth') + 'px',
                'left': $li.attr('tleft') + 'px'
            });

            // 移动viewpage
            mphome.components.extTabViewpage.find('.ext-tab-container').removeClass('active');
            mphome.components.extTabViewpage.find('.ext-tab-container[ext=' + $li.attr('ext') + ']').addClass('active');
        });

        // 响应主fab
        mphome.components.mainFab.delegate('li.fab-button-mini', 'click', function (e) {
            var $li = $(this);
            var extNm = $li.attr('ext');
            var $ext = mphome.components.extOverlay.find('.ext-ol-container[ext=' + extNm + ']');
            // TODO
        });

        mphome.components.extOverlay.delegate('.ext-ol-container-colse', 'click', function (e) {
            mphome.components.extOverlayLoading.removeClass('open');
            var $ext = mphome.components.extOverlay.find('.ext-ol-container.show');
            // TODO
        })

    }

    mphome.regAction = function (acNm, acFun) {
        mphome.action[acNm] = acFun;
    }

    // 注册action
    for (ac in hconf.actions) {
        mphome.regAction(ac, hconf.actions[ac]);
    }

    // 开始监控事件
    mphome.startListen();
    mphome.ajaxloading.enable();

    // 加载用户信息
    mphome.user.loadInfo(function () {

        mphome.sysTip.tip('加载用户信息');

        // 加载扩展组件
        mphome.ext.loadTab(function () {

            mphome.sysTip.tip('加载扩展组件');

            // 默认选中第一个
            var $ftab = mphome.components.extTabGroup.children('li').first();
            if ($ftab.length > 0) {
                $ftab.click();
            } else {
                mphome.components.extSwtich.remove();
                mphome.components.extBtnGroup.remove();
                mphome.components.ext.remove();
            }

            // FIXME 在ios下的safari中, 不隐藏ext, 会有横向滑动
            mphome.components.ext.hide();
            mphome.components.extOverlay.hide();

            // 加载菜单
            mphome.nav.loadMenu(function () {

                mphome.sysTip.tip('加载菜单');

                // 默认打开userMenu
                if (mphome.components.userMenu.children().length > 0) {
                    mphome.userMenu.open();
                }

                // 初始化, 判断当前url
                var $a = null;
                var cui = window.location.href.indexOf('#');
                var args = null;
                if (cui != -1) {
                    var url = window.location.href.substr(cui + 1);
                    var isEssApp = !(url[0] == '/');   // 不是以 '/' 开头, 则为app名称
                    if (isEssApp) {
                        // 带着:参数吗
                        var qi = url.indexOf(':');
                        if (qi != -1) {
                            args = url.substr(qi);
                            url = url.substr(0, qi);
                        }
                    }
                    // 普通页面,  格式为/xxx/xxxx?a=b&c=d
                    else {
                        // 带着?参数吗
                        var qi = url.indexOf('?');
                        if (qi != -1) {
                            args = url.substr(qi + 1);
                            url = url.substr(0, qi);
                        }
                    }
                    $a = $('a[url="' + url + '"]');
                    if ($a.length > 0) {
                        // TODO 如果匹配上了多个?看看参数
                        var $realA = $a;
                        if ($a.length > 1) {
                            $a.each(function (i) {
                                var $ele = $(this);
                                if ($ele.attr('args') == args) {
                                    $realA = $ele;
                                    return false;
                                }
                            });
                        }
                        mphome.nav.navUrl({
                            'url': url,
                            'label': $realA.attr('label'),
                            'args': args,
                            'page': $realA.attr('page')
                        });
                        $realA.parent().addClass('active');
                        $a = $realA;
                    } else {
                        $a = mphome.components.mainMenu.find('li:not(.has-sub-menu) > a').first();
                        $a.click();
                    }
                } else {
                    $a = mphome.components.mainMenu.find('li:not(.has-sub-menu) > a').first();
                    $a.click();
                }

                // 如果是子菜单中的, 打开菜单
                var $li = $a.parents('li.has-sub-menu');
                if ($li.length > 0) {
                    $li.addClass('open');
                    mphome.setUlHeight($li.children('ul'));
                }

                mphome.sysTip.tip('进入系统');

                // 显示桌面
                if (hconf.closeQuick) {
                    mphome.sysLoading.closeQuick();
                } else {
                    mphome.sysLoading.close();
                }
            });
        });
    });

    // onready

    if (hconf.onready) {
        hconf.onready();
    }


    window.$mp = window.$mp || {};
    window.$mp.home = mphome;

});
