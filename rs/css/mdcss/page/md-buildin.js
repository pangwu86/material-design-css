$(document).ready(function () {
    var $bd = $(document.body);

    var mdmessage = function (msg, top, delay) {
        top = top || 150;
        delay = delay || 800;
        var mlength = msg.length * 20 + 32 * 2;
        if (mlength > 300) {
            mlength = 300;
        }

        var html = '';
        html += '<div class="md-message paper rounded z-depth-5" style="opacity: 0; width:' + mlength + 'px; top: ' + top + 'px;">';
        html += '   <div class="md-message-content">' + msg + '</div>';
        html += '</div>';

        var $msg = $(html);
        $bd.append($msg);

        // 计算左右位置
        var wsize = $z.winsz();
        var mw = $msg.outerWidth();

        $msg.css('left', (wsize.width - mw) / 2);

        $msg.animate({
            opacity: 1,
        }, 'fast', function () {
            setTimeout(function () {
                $msg.animate({
                    opacity: 0,
                }, function () {
                    $msg.remove();
                });
            }, delay);
        });
    };

    window.$mp = window.$mp || {};
    window.$mp.message = mdmessage;

});