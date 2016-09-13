(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define( factory );
    } else {
        factory(jQuery);
    }
}(function($){

	var bumper = {
		timer:null,
		proxy: function(fn, ctx, interval) {
			interval = interval || 100;
			var that = this;
			return function bumperProxy() {
				window.clearTimeout(that.timer);
				that.timer = setTimeout(function() {
					fn.apply(ctx, arguments);
				}, interval);
			}
		}
	}

	var $window = $(window);
	var $document = $(document);

	var wrap = function(fn) {
		return function() {
			return fn.call(this, $window .height(), $document .height());
		}
	};

	var responder =  {
		resize: function(fn) {
			$(document).ready(wrap(fn));
			$window .resize(bumper.proxy(wrap(fn)));
		}
	};

	var resize = function(src, viewWidth, viewHeight, index, allcomputed) {
		var deferred = new $.Deferred();
		var cache = new Image();
		cache.onload = function() {
			var ratio = 1;
			var w = cache.width;
			var h = cache.height;
			var wRatio = viewWidth / w;
			var hRatio = viewHeight / h;
			var horizontal = wRatio >= hRatio
			if( allcomputed === true )
			{
				ratio = (!horizontal ? hRatio : wRatio);
				w = w * ratio;
				h = h * ratio;
			}
			else
			{
				if( wRatio < 1 || hRatio < 1 )
				{
					ratio = (horizontal ? hRatio : wRatio);
					w = w * ratio;
					h = h * ratio;
				}
			}

			deferred.resolve(w, h, horizontal, index, cache );
		}
		cache.src = src;
		return deferred;
	};

	var viewcenter=function(el, w, h, vw, vh){
		var $el = $(el);
		var left  = (vw - w) / 2;
		var top = (vh - h) / 2;

		$el.data({
				width : w ,
				height: h ,
				left  : left ,
				top   : top,
				zoomRatio : 100,
				vw: vw,
				vh: vh
			})
			.css({ width: w, height: h, left: left, top:  top });
	}
	var shrinkcenter = function(el, w, h, horizontal) {
		var $el = $(el);
		if (horizontal)
			$el.css({ left:'0', top :'50%', width: '100%',height: 'auto',  marginTop: h / -2 + 'px', marginLeft: 0 });
 		else
			$el.css({ left:'50%', top :'0', width: 'auto',height: '100%', marginLeft: w / -2 + 'px', marginTop: 0 });
	}

	//初始化页面内容
	var $sw = $(".swbanner-control");
	var $swView = $('<div class="swbanner-view"></div>')
	var $swBanner = $("<div class='swbanner-banner'></div>");
	var $swArrowLeft = $('<div class="arrow-left"></div>');
	var $swArrowRight = $('<div class="arrow-right"></div>');
	var $swArrowBLeft = $('<div class="arrow-big-left"></div>');
	var $swArrowBRight = $('<div class="arrow-big-right"></div>');
	var $swShrunkenWrap = $('<div class="swbanner-shrunken-container"></div>');
	var $swMessage = $('<div class="swbanner-message"></div>');
	var $controlbar = $sw.find('.controlbar-message');
	var $zoomPanel = $("<div class='zoom-panel'></div>")
	var initialized = false;
	var caches = [];
	var $images = $sw.find("img");
	var len = $images.length;
	var loaded = 0;
	var compute = function(){
		var svWidth = $sw.width();
		var svHeight = $sw.height() - 220;

		$images.each(function(i, el) {
			var $el = $(el);
			resize(el.src, svWidth, svHeight, i).done(function(w, h, horizontal, index, cache ) {
				viewcenter(el, w, h, svWidth, svHeight)
				if(caches.filter(function(o){ return o.index === index}).length === 0)
				{
					resize(cache.src, 180, 130, index, true).done(function(_w, _h, _horizontal, _index){
						loaded ++ ;
						caches.push({
							index: _index,
							el: cache
						});
						shrinkcenter(cache, _w, _h, _horizontal);
						if(len === loaded) initialize();
					});
				}
			});
		});
	};

	var initialize = function(options){

		//生成略缩图
		caches = caches.sort(function(a, b){ return a.index - b.index });
		for(var i = 0; i < caches.length ; i ++)
		{
			var $item = $("<div class='swbanner-shrunken-item'></div>").append(caches[i].el);
			$swShrunkenWrap.append($item);
		}

		//组装控件
		$swView.append($images).append($swMessage).append($swArrowBLeft).append($swArrowBRight).append($zoomPanel.html('100%'));
		$swBanner.append($controlbar).append($swArrowLeft).append($swShrunkenWrap).append($swArrowRight);
		$sw.append($swView).append($swBanner);


		//参数设置
		var $nav  = $swShrunkenWrap.find(".swbanner-shrunken-item");
		var scrollTimer = null;
		var zoomRatio = 100;

		//略缩图滚动
		$swBanner.on("mousedown", ".arrow-left,.arrow-right", function(){
			switch(this.className){
				case 'arrow-left':
					scrollTimer = window.setInterval(function(){
						$swShrunkenWrap.stop().scrollLeft($swShrunkenWrap.scrollLeft() - 10)
					},10)
					break;
				case 'arrow-right':
					scrollTimer = window.setInterval(function(){
						$swShrunkenWrap.stop().scrollLeft($swShrunkenWrap.scrollLeft() + 10)
					},10)
					break;
			}
			$(document).on('mouseup',function(){
				window.clearInterval(scrollTimer);
				scrollTimer = null;
			});
		});

		//大图左右切换
		$swView.on('click','.arrow-big-left,.arrow-big-right',function(){
			var className = this.className;
			if(!$images.is(":animated")){
				show(($images.filter('.active').index() + ( className === 'arrow-big-right' ? 1 : -1 )) % len);
			}
		});

		//略缩图点击切换
		$nav.click(function(){
			if(!$images.is(":animated")){
				//player();
				show($(this).index());
			}
		});

		//鼠标滚动操作
		var deltaStep = 15 ;
		$swView.on("mousewheel", 'img , .zoom-panel',function (e, delta, deltaX, deltaY) {
			var $current = $images.filter('.active');
			if (delta > 0) {
				// 放大
				$zoomPanel.trigger('show',[$current, deltaStep])
				$current.trigger('scale',[$current])
			} else if (delta < 0) {
				// 缩小
				if( $current.data('zoomRatio') > 10 )
				{
					$zoomPanel.trigger('show',[$current, -1 * deltaStep])
					$current.trigger('scale',[$current])
				}
			}
		});

		//图片缩放
		$images.on("scale",function(e, $current){
			ratio = $current.data('zoomRatio');
			var $this = $(this) ;
			var oow = $this.data("width");
			var ooh = $this.data("height");
			var ow = $this.width();
			var oh = $this.height();
			var ol = $this.data("left");
			var ot = $this.data("top");
			var w = oow * ratio / 100 ;
			var h = ooh * ratio / 100 ;

			var scaleX = ( event.clientX - ol ) / ow ;
			var scaleY = ( event.clientY - ot ) / oh ;

			var left = ol - scaleX * ( w - ow );
			var top = ot - scaleY * ( h - oh);
			$this.css({
				width : w ,
				height : h ,
				left : left ,
				top : top
			})
			.data({
				left : left ,
				top : top
			})
		})

		//图片移动
		var  $document = $(document);
		$images.on('mousedown',function(downEvent){
			downEvent.stopPropagation();
			var $this = $(this);
			var history = {
				x : downEvent.clientX ,
				y : downEvent.clientY ,
				left : 1*$this.css('left').replace(/px/,''),
				top : 1*$this.css('top').replace(/px/,''),
			};
			var left;
			var top;
			$document.off('.globalMouseMove').on('mousemove.globalMouseMove', function(moveEvent){
				var distance = {
					x : history.x - moveEvent.clientX,
					y : history.y - moveEvent.clientY
				};
				left = history.left - distance.x
				top = history.top - distance.y
				$this.css({
						left : left + 'px',
						top : top + 'px'
					})
			})

			$document.off('.globalMouseUp').on('mouseup.globalMouseDown', function(){
				$document.off('.globalMouseMove');
				$this.data({ left : left, top : top })
			});
			return false;
		})

		//缩放比例显示
		var zoomPanelClearTimer = null;
		$zoomPanel.on('show',function(e, $current , direction){
			var $this = $(this);
			var ratio = $current.data('zoomRatio');
			ratio += direction;
			$this.html(ratio + '%');
			$current.data('zoomRatio',ratio);
			clearTimeout(zoomPanelClearTimer);
			if(!$this.is(':visible'))
			{
				$this.fadeIn('fast');
			}
			zoomPanelClearTimer = setTimeout(function(){
				$this.fadeOut('fast')
			}, 1000)
		})

		//切换显示
		function show ( n ) {
			var $current = $images.eq(n);
			var $next = $current.siblings();
			var mes = $current.attr('alt') || "";
			$current.fadeIn('fast', function(){
				$current.addClass("active");
			});
			$next.filter('img').fadeOut('fast',function(){
				$next.removeClass("active");
			});
			$nav.eq(n).addClass("current").siblings().removeClass("current");
			if(mes)
				$swMessage.addClass('display')
			else
				$swMessage.removeClass('display')
			$swMessage.html(mes);
			if(scrollTimer === null)
				$swShrunkenWrap.stop().animate({scrollLeft:190 * n});
		}

		//键盘事件侦听
		$(document).on('keydown',function(e){
			switch (e.keyCode) {
				case 39:
					var index = $nav.index($nav.filter('.current')) + 1;
					show( index % len )
					// statements_1
					break;
				case 37:
					var index = $nav.index($nav.filter('.current')) - 1;
					show( index === -1 ? len - 1 : index )
					// statements_1
					break;
				default:
					// statements_def
					break;
			}
		})

		show ( 0 );

		$sw.addClass('created')
	}

	responder.resize(compute);
}))
