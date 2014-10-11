$(function() {

	//var timer = null;
	var delay = 500;
	var $lights = $('#lights');
	var $signal = $('#signal');

	function clean() {
		//if (timer) clearTimeout(timer);
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


		widthlamp: function() {
			$lights.removeClass('headlight highLight');

			$lights[$lights.hasClass('widthlamp') ? 'removeClass' : 'addClass']('widthlamp');
		},

		left: function() {
			//
			this.reset();

			$signal[$signal.hasClass('left') ? 'removeClass' : 'addClass']('left');

		},

		right: function() {
			//
			this.reset();

			$signal[$signal.hasClass('right') ? 'removeClass' : 'addClass']('right');


		},
		
		emergency: function() {
			this.reset();

			$signal[$signal.hasClass('emergency') ? 'removeClass' : 'addClass']('emergency');

		},

		reset: function() {

			$signal.removeClass('left right emergency');

		}
	};


	window.Lights = Lights;


});