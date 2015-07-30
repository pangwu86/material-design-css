/**
 * 本文件将提供 Nutz-JS 最基本的帮助函数定义支持，是 Nutz-JS 所有文件都需要依赖的基础JS文件
 *
 * @author  zozoh(zozohtnt@gmail.com)
 * 2012-10 First created
 */
(function () {
//===================================================================
    var zUtil = {
        //.............................................
        // 执行一个 HTML5 的文件上传操作，函数接受一个配置对象：
        //
        // {
        //     file : {..},     // 要上传的文件对象
        //     // 上传的进度回调，即接受 XMLHttpRequest 的 "progress" 事件监听函数
        //     progress : function(e){
        //         // 比较有用的是 e.loaded 和 e.total
        //     },
        //     // 下面的回调函数会在上传完成后，根据条件不同分别被调用
        //     beforeSend : function(xhr){..},      // 执行 xhr.send() 前调用
        //     done : function(re){..},             // 上传成功后调用
        //     fail : function(re){..},             // 上传失败后被调用
        //     complete : function(re, status){..}, // 无论成功还是失败都会被调用
        //     // 服务器返回后，可以通过下面的函数预先处理一下返回
        //     // 如果没有声明这个参数，则返回原生的 xhr 对象
        //     // 如果是值 "ajax"，则用 Nutz 标准的  AjaxReturn 来处理返回值
        //     evalReturn : function(xhr){return {
        //          re     : {..},         // 会被当做参数传入 done|faile|complete
        //          status : "done|fail"   // 表示成功还是失败
        //     }},
        //     // 下面是上传到服务器的目标设置
        //     // 上传的目标url是一个字符串模板，会用本对象自身的键值来填充
        //     url  : "/o/upload/?nm=<%=file.name%>&sz=<%=file.size%>"
        // }
        uploadFile: function (opt) {
            // 没必要上传
            if (!opt.file)
                throw "!!! without field : 'file' ";
            // 开始上传
            var xhr = new XMLHttpRequest();
            // 检查
            if (!xhr.upload) {
                throw "XMLHttpRequest object don't support upload for your browser!!!";
            }
            // 用 ajax 方式处理返回值
            if ("ajax" == opt.evalReturn) {
                opt.evalReturn = function (xhr) {
                    // 如果是 200 那么具体看 AjaxReturn 的内容
                    if (xhr.status == 200) {
                        var ajaxRe = $z.fromJson(xhr.responseText);
                        if (ajaxRe.ok)
                            return {re: ajaxRe.data, status: "done"};
                        return {re: ajaxRe, status: "fail"};
                    }
                    // 否则一定是错误
                    return {re: xhr, status: "fail"};
                };
            }
            // 默认的处理方式
            else if (!(typeof opt.evalReturn == "function")) {
                opt.evalReturn = function (xhr) {
                    return {re: xhr, status: xhr.status == 200 ? "done" : "fail"};
                };
            }
            // 进度回调
            if (typeof opt.progress == "function")
                xhr.upload.addEventListener("progress", opt.progress, false);
            // 完成的处理
            xhr.onreadystatechange = function (e) {
                if (xhr.readyState == 4) {
                    var r = opt.evalReturn(xhr);
                    $z.invoke(opt, r.status, [r.re]);
                    // 统一处理完成
                    $z.invoke(opt, "complete", [r.re, r.status]);
                }
            };
            // 准备请求对象头部信息
            var url = (_.template(opt.url))(opt);
            //console.log("upload to:", url);
            xhr.open("POST", url, true);
            xhr.setRequestHeader('Content-type', "application/x-www-form-urlencoded; charset=utf-8");
            // 修改提示图标的标签
            $z.invoke(opt, "beforeSend", [xhr]);
            // 执行上传
            xhr.send(opt.file);
        },
        //.............................................
        // 设置一个 input 的值，如果值与 placeholder 相同，则清除值
        setInputVal: function (jInput, val) {
            var dft = jInput.attr("placeholder");
            if (dft == val)
                jInput.val("");
            else
                jInput.val(val);
        },
        //.............................................
        // 获得页面的锚值，即在 href 后面的
        pageAnchor: function () {
            var href = window.location.href;
            var pos = href.lastIndexOf("#");
            if (pos > 0)
                return href.substring(pos + 1);
            return null;
        },
        //.............................................
        // 得到函数体的代码
        getFuncBodyAsStr: function (func) {
            var str = func.toString();
            var posL = str.indexOf("{");
            var re = $.trim(str.substring(posL + 1, str.length - 1));
            // Safari 会自己加一个语句结尾，靠
            if (re[re.length - 1] == ";")
                return re.substring(0, re.length - 1);
            return re;
        },
        //.............................................
        // 调用某对象的方法，如果方法不存在或者不是函数，无视
        invoke: function (obj, funcName, args, me) {
            if (obj) {
                var func = obj[funcName];
                if (typeof func == 'function') {
                    func.apply(me || obj, args || []);
                }
            }
        },
        //.............................................
        // 打开一个新的窗口
        openUrl: function (url, target) {
            var html = '<form target="' + (target || '_blank') + '" method="GET"';
            html += ' action="' + url + '" style="display:none;">';
            html += '</form>';
            var jq = $(html).appendTo(document.body);
            jq[0].submit();
            jq.remove();
        },
        // 模拟POST提交
        postForm: function (url, data) {
            var html = '';
            html += '<form action="' + url + '" method="POST" style="display:none;">';
            for (var nm in data) {
                html += '<input type="text" name="' + nm + '" value="' + data[nm] + '">';
            }
            html += '</form>';
            var jq = $(html).appendTo(document.body);
            jq[0].submit();
            jq.remove();
        },
        //.............................................
        // 返回一个时间戳，其它应用可以用来阻止浏览器缓存
        timestamp: function () {
            return new Date().getTime();
        },
        //.............................................
        // 生成一个随机字符串
        randomString: function (length) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
            if (!length) {
                length = Math.floor(Math.random() * chars.length);
            }
            var str = '';
            for (var i = 0; i < length; i++) {
                str += chars[Math.floor(Math.random() * chars.length)];
            }
            return str;
        },
        //.............................................
        // 扩展第一个对象，深层的，如果遇到重名的对象，则递归
        extend: function (a, b) {
            if (_.isObject(a) && _.isObject(b)) {
                for (var key in b) {
                    var av = a[key];
                    if (_.isArray(av) || _.isFunction(av) || _.isDate(av) || _.isRegExp(av)) {
                        a[key] = b[key];
                    } else if (_.isObject(av)) {
                        this.extend(av, b[key]);
                    } else {
                        a[key] = b[key];
                    }
                }
                return a;
            }
            // 否则不能接受
            throw "can not extend a:" + a + " by b:" + b;
        },
        //.............................................
        winsz: function () {
            if (window.innerWidth) {
                return {
                    width: window.innerWidth,
                    height: window.innerHeight
                };
            }
            if (document.documentElement) {
                return {
                    width: document.documentElement.clientWidth,
                    height: document.documentElement.clientHeight
                };
            }
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            };
        },
        //.............................................
        // json : function(obj, fltFunc, tab){
        //     // toJson
        //     if(typeof obj == "object"){
        //         return JSON.stringify(obj, fltFunc, tab);
        //     }
        //     // fromJson
        //     if (!obj) {
        //         return null;
        //     }
        //     return JSON.parse(obj, fltFunc);
        // },
        //.............................................
        toJson: function (obj, fltFunc, tab) {
            return JSON.stringify(obj, fltFunc, tab);
        },
        //.............................................
        fromJson: function (str, fltFunc) {
            if (!str)
                return null;
            try {
                return JSON.parse(str, fltFunc);
            } catch (e1) {
                try {
                    return eval('(' + str + ')');
                } catch (e2) {
                    throw e2 + " \n" + str;
                }
            }
        },
        //.............................................
        // 获得当前系统当前浏览器中滚动条的宽度
        // TODO 代码实现的太恶心，要重构!
        scrollBarWidth: function () {
            if (!window.SCROLL_BAR_WIDTH) {
                var newDivOut = "<div id='div_out' style='position:relative;width:100px;height:100px;overflow-y:scroll;overflow-x:scroll'></div>";
                var newDivIn = "<div id='div_in' style='position:absolute;width:100%;height:100%;'></div>";
                var scrollWidth = 0;
                $('body').append(newDivOut);
                $('#div_out').append(newDivIn);
                var divOutS = $('#div_out');
                var divInS = $('#div_in');
                scrollWidth = divOutS.width() - divInS.width();
                $('#div_out').remove();
                $('#div_in').remove();
                window.SCROLL_BAR_WIDTH = scrollWidth;
            }
            return window.SCROLL_BAR_WIDTH;
        },
        // 返回当前时间
        currentTime: function (date) {
            date = date || new Date();
            return zUtil.dateToYYMMDD(date) + " " + zUtil.dateToHHMMSS(date);
        },
        // 返回当前时分秒
        dateToYYMMDD: function (date, split) {
            date = date || new Date();
            split = (split == null || split == undefined) ? "-" : split;
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return year + split + zUtil.alignLeft(month, 2, '0') + split + zUtil.alignLeft(day, 2, '0');
        },
        // 返回当前年月日
        dateToHHMMSS: function (date, split) {
            date = date || new Date();
            split = (split == null || split == undefined) ? "-" : split;
            var hours = date.getHours()
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            return zUtil.alignLeft(hours, 2, '0') + split + zUtil.alignLeft(minutes, 2, '0') + split + zUtil.alignLeft(seconds, 2, '0');
        },
        // 任何东西转换为字符串
        anyToString: function (obj) {
            if (_.isUndefined(obj) || _.isNull(obj)) {
                return "";
            }
            if (_.isString(obj)) {
                return obj;
            }
            if (_.isNumber(obj)) {
                return "" + obj;
            }
            if (_.isObject(obj)) {
                return zUtil.toJson(obj);
            }
            // TODO 补全其他类型
            zUtil.noImplement();
        },
        // 补全右边
        alignRight: function (str, length, char) {
            str = zUtil.anyToString(str);
            if (str.length >= length) {
                return str;
            }
            return str + zUtil.dupString(char, length - str.length);
        },
        // 补全左边
        alignLeft: function (str, length, char) {
            str = zUtil.anyToString(str);
            if (str.length >= length) {
                return str;
            }
            return zUtil.dupString(char, length - str.length) + str;
        },
        // 重复字符
        dupString: function (char, num) {
            if (!char || num < 1) {
                return "";
            }
            var str = "";
            for (var i = 0; i < num; i++) {
                str += char;
            }
            return str;
        },
        // 未实现
        noImplement: function () {
            throw new Error("Not implement yet!");
        },
        // 将字符串拆分，并无视空字符串
        splitIgnoreEmpty: function (str, separator) {
            var ss = str.split(separator);
            var re = [];
            for (var i = 0; i < ss.length; i++) {
                var s = ss[i];
                if (s)
                    re.push(s);
            }
            return re;
        },
        //============== 计算文件大小
        sizeText: function (sz) {
            sz = parseInt(sz);
            // KB
            var ckb = sz / 1024;
            if (ckb > 1024) {
                // MB
                var cmb = ckb / 1024;
                if (cmb > 1024) {
                    // GB
                    var cgb = cmb / 1024;
                    return cgb.toFixed(2) + " GB";
                } else {
                    return cmb.toFixed(2) + " MB";
                }
            } else {
                return ckb.toFixed(2) + " KB";
            }
        }
    };

    // log
    zUtil.logConf = {
        enable: true,               // 是否启动log输出
        trace: false,               // 是否显示调用trace
        showTime: true,             // 是否打印时间,
        showMS: true                // 是否显示毫秒
    };

    zUtil.log = function (log) {
        if (zUtil.logConf.enable) {
            var logPrefix = "";
            // 显示时间点
            if (zUtil.logConf.showTime) {
                logPrefix += '---- ';
                var date = new Date();
                logPrefix += zUtil.currentTime(date);
                if (zUtil.logConf.showMS) {
                    logPrefix += "." + date.getMilliseconds();
                }
                logPrefix += ' ----\n';
            }
            console.debug(logPrefix + log);
            if (zUtil.logConf.trace) {
                console.trace();
            }
        }
    };

// 创建 NutzUtil 的别名
    window.$z = zUtil;
//===================================================================
    if (typeof define === "function" && define.cmd) {
        define("zutil", ["underscore"], function () {
            return zUtil;
        });
    }
//===================================================================
})();