(function($) {
    var back = new Image();
    back.src = 'dist/style/images/background2.png';
    back.onload = function() {
        document.body.style.backgroundImage = 'url(\"dist/style/images/background2.png\")'
    };
    var $win = $(window);
    $(function() {
        $win.resize(function() {
            $('.face').css({ fontSize: $win.width() / 32 + 'px' });
            return arguments.callee;
        }())
    })
})(jQuery);