(function() {
    var back = new Image();
    back.src = 'dist/style/images/background.jpg';
    back.onload = function() {
        document.body.style.backgroundImage = 'url(\"dist/style/images/background.jpg\")'
    };

    var loadImage = function(i) {
        var $this = $(this);
        var $img = $("<img />")
        $this.append($img);
        var img = $img.get(0);
        $this.addClass('loaded');
        var onerrorload = false;
        var errortime = 0;
        window.setTimeout(function() {
            img.onerror = function() {
                if (errortime++ > 1) { $img.remove(); return; }
                var src = $this.attr('data-error');
                if (!src) {
                    src = "Content/style/icons/noimage.png";
                    onerrorload = true;
                }
                this.src = $this.attr('data-error') || "Content/style/icons/noimage.png";
            }
            img.onload = function() {
                var ch = $this.height();
                var cw = $this.width();
                var c = cw / ch;
                var rh = img.naturalHeight || img.height;
                var rw = img.naturalWidth || img.width;
                var r = rw / rh;
                if ($this.data('model') === 'min' || onerrorload) {
                    if (c > r) {
                        $img.attr("height", "100%");
                    } else {
                        $img.attr("width", "100%");
                    }
                } else {
                    $this.css({
                        position: 'relative',
                        overflow: 'hidden'
                    });
                    if (c == r) {
                        $img.attr({ width: '100%' });
                        $img.css({
                            position: 'absolute',
                            top: 0,
                            left: 0
                        })
                    } else if (c > r) {
                        $img.attr({ width: '100%' })
                        var realheight = cw * rh / rw
                        $img.css({
                            position: 'absolute',
                            top: '50%',
                            left: 0,
                            marginTop: -1 * realheight / 2 + 'px'
                        })
                    } else if (c < r) {
                        $img.attr({ height: '100%' })
                        var realwidth = rw * ch / rh;
                        $img.css({
                            position: 'absolute',
                            left: '50%',
                            top: 0,
                            marginLeft: -1 * realwidth / 2 + 'px'
                        })
                    }
                }
                $this.addClass('show')
            };
            img.src = $this.attr('data-src');
        }, i * 10)
    };


    function scroll(isleft) {

    }
    $(function() {
        var touchstart = null;
        $('.img-container:not(.loaded)').each(loadImage);
        $('.sw-banner-3d-content').on('touchstart mousedown', function(e) {
            touchstart = e.clientX || e.originalEvent.targetTouches[0].clientX;
        }).on('touchend mouseup', function(e) {
            var scrollLeft = touchstart - (e.clientX || e.originalEvent.changedTouches[0].clientX) > 0;
            scroll(scrollLeft);
        });
    });

})()