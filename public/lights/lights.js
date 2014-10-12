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
			$lights.removeClass('highlight widthlamp');

			$lights[$lights.hasClass('headlight') ? 'removeClass' : 'addClass']('headlight');

		},

		highlight: function() {
			$lights.removeClass('widthlamp');

			if($lights.hasClass('highlight')){
				$lights.removeClass('highlight').addClass('headlight');
			}else{
				$lights.addClass('highlight').removeClass('headlight');
			}

		},


		widthlamp: function() {
			$lights.removeClass('headlight highlight');

			$lights[$lights.hasClass('widthlamp') ? 'removeClass' : 'addClass']('widthlamp');
		},

		closelamp: function(){
			$lights.removeClass('headlight highlight widthlamp');
		},

		left: function() {
			//
			this.reset();

			$signal.addClass('left');

		},

		right: function() {
			//
			this.reset();

			$signal.addClass('right');

		},
		
		emergency: function() {

			$signal[$signal.hasClass('emergency') ? 'removeClass' : 'addClass']('emergency');

		},

		reset: function() {

			$signal.removeClass('left right');

		},
		
		clean: function(){
			this.reset();
			this.closelamp();
		}
	};


	window.Lights = Lights;


});