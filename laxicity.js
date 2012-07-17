;(function($, window, document, undefined) {
	var pluginName = 'laxicity', defaults = {
		scrollSpy : null
	};
	function Plugin(element, options) {
		this._name = pluginName;
		this.element = $(element);
		this.options = $.extend({}, defaults, options);
		this.id = 'l_' + Math.round(Math.random() * 100000);
		this.x = this.element.data('x');
		this.y = this.element.data('y');
		this.dir = this.element.data('direction');
		this.velocity = this.element.data('velocity');
		this.referential = this.element.closest('[data-laxicity=block]');
		this.referentialId = this.referential.attr('id');
		this.referential.css({
			overflow : 'hidden',
			position : 'relative'
		});
		this.element.attr('data-laxicity', 'original');
		this._init();
		var self = this;
		$(window).scroll(function () {
			var scrollTop = parseInt($(document).scrollTop()),
				ratio = (self.referentialTop - scrollTop) * parseFloat(self.velocity == undefined ? 0 : self.velocity);
			if (ratio <= 0) ratio = 0;
			if (self.dir == 'top' || self.dir == undefined)
				self.$clone.css('margin-top', ratio);
			else if (self.dir == 'bottom')
				self.$clone.css('margin-top', -ratio);
			else if (self.dir == 'left')
				self.$clone.css('margin-left', ratio);
			else if (self.dir == 'right')
				self.$clone.css('margin-left', -ratio);
			self._scrollSpy(scrollTop);
		}).resize(function () {
			$('#' + self.id).remove();
			self.element.css('visibility', 'visible');
			self._init();
		});
	};
	Plugin.prototype._init = function () {
		this.referentialTop = this.referential.offset().top;
		this.pos = this.element.position();
		this.pos = {
			left : this.x != null ? this.x : this.pos.left,
			top : this.y != null ? this.y : this.pos.top
		};
		this.$clone = this.element.clone();
		this.$clone.css({
			position : 'absolute',
			top : this.pos.top,
			left : this.pos.left,
			width: this.element.width(),
			height: this.element.height()
		}).attr({
			'data-laxicity' : 'item',
			id : this.id
		}).appendTo(this.referential);
		this.element.css('visibility', 'hidden');
	};
	Plugin.prototype._scrollSpy = function (scrollTop) {
		if (this.options.scrollSpy != null && (this.referentialTop <= scrollTop)) {
			$('a', $(this.options.scrollSpy)).removeClass('active');
			$('a[href="#' + this.referentialId + '"]', $(this.options.scrollSpy)).addClass('active');
		}	
	};
	$.fn[pluginName] = function(options) {
		return this.each(function() {
			if(!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
		});
	}
})(jQuery, window, document);