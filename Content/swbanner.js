(function($){

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

	var resize = function(src, viewWidth, viewHeight, index) {
		var deferred = new $.Deferred();
		var cache = new Image();
		cache.onload = function() {
			var ratio = 1;
			var w = cache.width;
			var h = cache.height;
			var wRatio = viewWidth / w;
			var hRatio = viewHeight / h;
			var horizontal = wRatio <= hRatio
			ratio = (horizontal ? hRatio : wRatio);
			w = w * ratio;
			h = h * ratio;

			deferred.resolve(w, h, horizontal, index, cache );
		}
		cache.src = src;
		return deferred;
	};

	var center = function(el, w, h, horizontal) {
		var $el = $(el);
		if (horizontal)
			$el.removeClass('vertical').addClass('horizontal')
			.css({ marginLeft: w / -2 + 'px', marginTop: 0 });
		else
			$el.removeClass('horizontal').addClass('vertical')
			.css({ marginTop: h / -2 + 'px', marginLeft: 0 });
	}

	//初始化页面内容
	//返回值true/false决定是否执行util.js下的_init_方法
	var $sw = $(".swbanner-control");
	var $swView = $('<div class="swbanner-view"></div>')
	var $swBanner = $("<div class='swbanner-banner'></div>");
	var $swArrowLeft = $('<div class="arrow-left"></div>');
	var $swArrowRight = $('<div class="arrow-right"></div>');
	var $swShrunkenWrap = $('<div class="swbanner-shrunken-container"></div>');
	var $swMessage = $('<div class="swbanner-message"></div>');
	var initialized = false;
	var caches = {};
	var $images = $sw.find("img");
	var len = $images.length;
	var loaded = 0;
	var compute = function(){
		var svWidth = $sw.width();
		var svHeight = $sw.height() - 220;

		$images.each(function(i, el) {
			var $el = $(el);
			resize(el.src, svWidth, svHeight, i).done(function(w, h, horizontal, index, cache ) {
				center(el, w, h, horizontal)
				if(!caches['shrunken' + index])
				{
					resize(cache.src, 180, 130, index).done(function(_w, _h, _horizontal, _index){
						loaded ++ ;
						caches['shrunken' + _index] = cache;
						center(cache, _w, _h, _horizontal);
						var $item = $("<div class='swbanner-shrunken-item'></div>").append(cache);
						$swShrunkenWrap.append($item);
						if(len === loaded) initialize();
					});
				}
			});
		});
	};

	var initialize = function(options){
		//组装控件
		$swView.append($images).append($swMessage);
		$swBanner.append($swArrowLeft).append($swShrunkenWrap).append($swArrowRight);
		$sw.append($swView).append($swBanner)

		var defaults = {
			animateTime: 3000,
			delayTime: 2000
		}
		var setting=$.extend({},defaults,options);
		var $nav  = $swShrunkenWrap.find(".swbanner-shrunken-item");
		var index = 0;
		var timer;
		var scrollTimer = null;

		$swBanner.find(".arrow-left,.arrow-right").mousedown(function(){
			switch(this.className){
				case 'arrow-left':
					scrollTimer=window.setInterval(function(){
						$swShrunkenWrap.stop().scrollLeft($swShrunkenWrap.scrollLeft() - 10)
					},10)
					break;
				case 'arrow-right':
					scrollTimer=window.setInterval(function(){
						$swShrunkenWrap.stop().scrollLeft($swShrunkenWrap.scrollLeft() + 10)
					},10)
					break;
			}
			$(document).on('mouseup',function(){
				window.clearInterval(scrollTimer);
				scrollTimer = null;
			});
		})

		function show ( n ) {
			var $target = $images.eq(n);
			var mes = $target.attr('alt') || "";
			$target.addClass("active").siblings().removeClass("active");
			$nav.eq(n).addClass("current").siblings().removeClass("current");
			if(mes)
				$swMessage.addClass('display')
			else
				$swMessage.removeClass('display')
			$swMessage.html(mes);
			if(scrollTimer === null)
				$swShrunkenWrap.animate({scrollLeft:190 * n});
		}

		function player(){
			clearInterval(timer);
			timer = setInterval(
				function(){
					show( ($swShrunkenWrap.find(".current").index() + 1) % len);
				},setting.delayTime)
		}

		$nav.click(function(){
			if(!$images.is(":animated")){
				player();
				show($(this).index());
			}
		});

		$images.hover(
			function(){ clearInterval(timer); },
			function(){ player(); });

		show ( 0 );
		player();
		$sw.addClass('created')
	}

	responder.resize(compute);
})(jQuery)
