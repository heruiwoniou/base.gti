(function($) {
    var back = new Image();
    back.src = 'dist/style/images/background1.jpg';
    back.onload = function() {
        document.body.style.backgroundImage = 'url(\"dist/style/images/background1.jpg\")'
    };

    function loadImage(i) {
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
                $this.data({ rh: rh, rw: rw });
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

    $(function() {
        var touchstart = null;
        var $win = $(window);
        var touchdistance = 50;
        var seed = 87.5;
        var vm;

        function getem(size) {
            return Math.floor(size / seed * 100) / 100 + 'em';
        }
        var SECTION_POSITION = [
            { height: getem(60) },
            { height: getem(60) },
            { height: getem(145) },
            { height: getem(60) },
            { height: getem(60) }
        ]
        var ITEM_POSITION = [{
                left: getem(-425),
                top: getem(145),
                width: getem(380),
                height: getem(310)
            },
            {
                left: getem(45),
                top: getem(145),
                width: getem(380),
                height: getem(310)
            },
            {
                left: getem(360),
                top: getem(55),
                width: getem(580),
                height: getem(490)
            },
            {
                left: getem(875),
                top: getem(145),
                width: getem(380),
                height: getem(310)
            },
            {
                left: getem(1300),
                top: getem(145),
                width: getem(380),
                height: getem(310)
            }
        ]
        var timeout = 100;
        var items, scrollseed, defaultscrollseed = 5000;;
        var source = [];


        function initSwbanner() {
            $('.sw-banner-3d').show();
            scrollseed = defaultscrollseed;
            items = $('.sw-banner-3d-item');
            show();
            /**
             * 加载图片
             * */
            $('.img-container').empty().removeClass('loaded show').each(loadImage);
        }

        function show() {
            items.finish().removeClass('current').find('.content').finish().end().each(function(i) {
                var that = $(this);
                if (i >= 1 && i <= 3) {
                    that.css(ITEM_POSITION[4]).find('.content').css(SECTION_POSITION[4]);
                    if (i == 2) {
                        that.addClass('current');
                    }
                    window.setTimeout(function() {
                        that.animate(ITEM_POSITION[i], { easing: 'easeOutCirc' }).find('.content').animate(SECTION_POSITION[i], {
                            complete: function(status) {
                                if (status == true)
                                    that.find('.img-container').empty().removeClass('loaded show');
                                else that.find('.img-container').each(loadImage)
                                return arguments.callee;
                            }(true)
                        });
                    }, timeout * (i - 1));
                } else {
                    that.css(ITEM_POSITION[i]).find('.content').css(SECTION_POSITION[i]);
                }
            });
        }

        function hide() {
            items.each(function(i) {
                var that = $(this);
                if (i >= 1 && i <= 3) {
                    window.setTimeout(function() {
                        that.animate(ITEM_POSITION[0], { easing: 'easeOutCirc' }).find('.content').animate(SECTION_POSITION[0], {
                            complete: function(status) {
                                if (status == true)
                                    that.find('.img-container').empty().removeClass('loaded show');
                                else that.find('.img-container').each(loadImage)
                                return arguments.callee;
                            }(true)
                        });
                    }, timeout * (i - 1));
                } else
                    that.css(ITEM_POSITION[0]).find('.content').css(SECTION_POSITION[0]);
            });
        }


        //计算　滚动
        function scroll(isleft) {
            if (items.is(":animated")) return;
            if (isleft) {
                scrollseed--;
                items.removeClass('current').each(function(i) {
                    var $this = $(this);
                    var index = (i + scrollseed) % 5;
                    var callback = undefined;
                    if (index == 4) {
                        $this.css(ITEM_POSITION[index]).find('.content').css(SECTION_POSITION[index]);
                    }
                    if (index == 2) {
                        $this.addClass('current');
                    }
                    $this.animate(ITEM_POSITION[index])
                        .find('.content').animate(SECTION_POSITION[index], {
                            complete: function(status) {
                                if (status == true)
                                    $this.find('.img-container').empty().removeClass('loaded show');
                                else $this.find('.img-container').each(loadImage)
                                return arguments.callee;
                            }(true)
                        });
                });
            } else {
                scrollseed++;
                items.removeClass('current').each(function(i) {
                    var $this = $(this);
                    var index = (i + scrollseed) % 5;
                    if (index == 0) {
                        $this.css(ITEM_POSITION[index]).find('.content').css(SECTION_POSITION[index]);
                    }
                    if (index == 2) {
                        $this.addClass('current');
                    }
                    $this.animate(ITEM_POSITION[index])
                        .find('.content').animate(SECTION_POSITION[index], {
                            complete: function(status) {
                                if (status == true)
                                    $this.find('.img-container.show').empty().removeClass('loaded show');
                                else $this.find('.img-container').each(loadImage)
                                return arguments.callee;
                            }(true)
                        });
                });
            }
            updateCurrent(isleft, defaultscrollseed - scrollseed)

        }

        /**
         * 加载事件
         * */
        $('.sw-banner-3d-content').on('touchstart mousedown', function(e) {
            touchstart = e.clientX || e.originalEvent.targetTouches[0].clientX;
        }).on('touchend mouseup', function(e) {
            var d = touchstart - (e.clientX || e.originalEvent.changedTouches[0].clientX);
            if (Math.abs(d) > touchdistance) {
                var scrollLeft = d > 0;
                scroll(scrollLeft);
            }
        });


        /**
         * 绑定windowresize事件
         * */
        $win.resize(function() {
            $('.img-container.show').empty().removeClass('loaded show').each(loadImage);
            $('.sw-banner-3d').css({ fontSize: $win.width() / 21.75 + 'px' });
            return arguments.callee;
        }());

        function getArticles(type) {
            type = type || "0";
            var result = [];
            $.ajax({
                url: 'server/article',
                data: { type: type || '海大新闻' },
                async: false,
                success: function(types) {
                    result = types;
                },
                error: function() {
                    for (var i = 0; i < 10; i++) {
                        result.push({
                            head: type + ':中国海洋大学举办第五届中俄北极论坛' + i,
                            img: 'dist/style/images/new_' + (i % 4) + '.jpg',
                            content: '第五届中俄北极论坛于10月31日在青岛举行。本届论坛由中国海洋大学主办，论坛议题是“中俄北极合作：障碍与前景”。中国海洋大学党委副书记、副校长陈锐致欢迎辞，法政学院院长刘惠荣教授致开幕词。 　　陈锐在致辞中代表学校对从事北极问题研究的中外学者代表在青岛聚首表示热烈欢迎，他预祝第五届中俄北极论坛顺利召开，并希望中俄两国学者在学术上广泛交流，推动中俄两国合作取得更大突破。刘惠荣院长在致辞中指出，随着全球气候的变化和国际政治格局的变动，北极相关议题日益走进人们的视野，特别是中国加入北极理事会后，北极地区更是与中国的切身利益息息相关。俄罗斯作为最大的北极国家，与中国在北极问题上有着诸多共同利益。',
                            date: '2016/09/13',
                            href: 'http://www.baidu.com'
                        })
                    }
                }
            });
            source = result;
            return result.slice(0, 5);;
        }

        function updateCurrent(isleft, step) {
            var target, start;
            if (isleft) {
                target = Math.abs(step - 1) % 5;
                start = (5 + Math.abs(step - 1) % source.length) % source.length;
            } else {
                target = (5 - Math.abs(step % 5)) % 5;
                start = (source.length - Math.abs(step % source.length)) % source.length;
            }
            vm.articles.set(target, source.slice(start, start + 1)[0]);
        }



        vm = avalon.define({
            $id: 'sw-banner-3d',
            /**
             * 参数
             * 
             * */
            selectedIndex: 0,
            types: function() {
                var result = [];
                $.ajax({
                    url: 'server/types',
                    async: false,
                    success: function(types) {
                        result = types;
                    },
                    error: function() {
                        result = [
                            { id: 1, name: '海大新闻' },
                            { id: 2, name: '院系动态' },
                            { id: 3, name: '部处通知' },
                            { id: 4, name: '校内信息' },
                            { id: 5, name: '会议通知' }
                        ]
                    }
                });

                return result;
            }(),
            articles: getArticles(),
            /**
             * 方法
             * */
            select: function(index, type, el) {
                if ($(el).closest('li').hasClass('select')) return;
                var that = this;
                this.selectedIndex = index;
                scrollseed = 5000;
                hide();
                //更新数据
                window.setTimeout(function() {
                    that.articles = getArticles(type);
                    initSwbanner();
                }, 400);
            }
        });
        vm.$watch('onReady', function() {
            window.setTimeout(function() {
                initSwbanner();
            })
        });
        avalon.scan(document.body);
    });

})(jQuery)