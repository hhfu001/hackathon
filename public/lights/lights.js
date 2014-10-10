$(function() {

	var timer = null;
	var delay = 500;
	var $lights = $('#lights');
	var $signal = $('#signal');

	function clean() {
		if (timer) clearTimeout(timer);
	}

	var Lights = {

		headlight: function() {
			//和远光灯互斥
			$lights.removeClass('highlight');

			$lights[$lights.hasClass('headlight') ? 'removeClass' : 'addClass']('headlight');

		},

		highlight: function() {
			//和近光灯互斥
			$lights.removeClass('headlight');

			$lights[$lights.hasClass('highlight') ? 'removeClass' : 'addClass']('highlight');
		},

		left: function() {
			clean();
			var self = this;

			//
			$signal.removeClass('right');

			timer = setTimeout(function() {
				$signal[$signal.hasClass('left') ? 'removeClass' : 'addClass']('left');

				self.left();
			}, delay);

		},

		right: function() {
			var self = this;
			clean();

			//
			$signal.removeClass('left');

			timer = setTimeout(function() {
				$signal[$signal.hasClass('right') ? 'removeClass' : 'addClass']('right');

				self.right();
			}, delay);

		},

		widthlamp: function() {
			$lights.removeClass('headlight highLight');

			$lights[$lights.hasClass('widthlamp') ? 'removeClass' : 'addClass']('widthlamp');
		},
		
		emergency: function() {
			var self = this;
			clean();

			$signal.removeClass('left right');

			timer = setTimeout(function() {
				$signal[$signal.hasClass('emergency') ? 'removeClass' : 'addClass']('emergency');

				self.emergency();
			}, delay);


		},

		reset: function() {
			clean();

			$signal.removeClass('left right');

		}
	};


	window.Lights = Lights;


});