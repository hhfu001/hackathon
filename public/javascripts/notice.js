
(function(window, undefined){

	var instance;

	var Notice = Backbone.View.extend({

		className: 'g-notice',

		events: {
			'click': 'close',
			'click .g-notice-close': 'close'
		},

		initialize: function(options){
			this.options = options || {};
			// 传递container参数设置通知层所在容器位置
			this.$container = $(this.options.container || document.body);
			this.render();
		},

		render: function(){
			var html = '<div class="g-notice-msg"></div>';

			if (!this.options.autohide) {
				html += '<div class="g-notice-close"><i class="icon-x"></i></div>';
			}

			if (this.options.fixed) {
				this.$el.addClass('g-notice-fixed');
			}

			if (this.options.ltr) {
				this.$el.addClass('g-notice-ltr');
			}

			if (this.options.error) {
				this.$el.addClass('g-notice-err');
			}

			this.$el.html(html);
			this.$msg = this.$('.g-notice-msg');
			this.$container.append(this.el);
			return this;
		},

		show: function(msg, error){
			var self = this;
			this.$msg.html(msg);

			if (this.timer) clearTimeout(this.timer);

			if (this.options.autohide) {
				this.timer = setTimeout(function(){
					self.hide();
				}, this.options.fadeout || 3000);
			}

			if (error) {
				this.$el.addClass('g-notice-err');
			}

			setTimeout(function(){
				self.$el.addClass('g-notice-on');
				self.trigger('notice:show');
			}, 0);

			return this;
		},

		hide: function(remove){
			var self = this;
			if (remove) {
				setTimeout(function(){
					self.remove();
					self.trigger('notice:remove');
				}, 500);
			}
			this.$el.removeClass('g-notice-on g-notice-err');
			this.trigger('notice:hide', [ !!remove ]);
			return this;
		},

		close: function(event){
			event.preventDefault();
			if (this.timer) clearTimeout(this.timer);
			this.hide();
		}

	});

	/* 通用类方法创建一个标准通知消息层并显示 */
	Notice.msg = function(msg, autohide, fadeout){
		Notice.close();
		instance = new Notice({ fixed: true, autohide: autohide, fadeout: fadeout });
		instance.show(msg);
	};

	Notice.err = function(msg, autohide, fadeout){
		Notice.close();
		instance = new Notice({ fixed: true, autohide: autohide, fadeout: fadeout, error: true });
		instance.show(msg);
	};

	Notice.close = function(){
		instance && instance.hide(true);
	};

	window.Notice = Notice;

})(window);
