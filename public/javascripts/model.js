(function(window, undefined){

	var lightMap = {
		'headlight': 1,	// 近光灯
		'highlight': 2,	// 远光灯
		'widthlamp': 4, // 示宽灯
		'emergency': 8, // 危险报警灯
		'right': 16, 	// 右转灯
		'left': 32,		// 左转灯
		'reset': 64		// 转向恢复原位
	};

	var lightAction = [{
		name: '开启灯光',
		playAt: 2,
		second: 5,
		duration: 3
	}, {
		name: '通过人行横道线',
		playAt: 6,
		second: 6
	}, {
		name: '直行通过路口',
		playAt: 9,
		second: 6
	}, {
		name: '照明不良道路行驶',
		playAt: 12,
		second: 6
	}, {
		name: '左转弯通过路口',
		playAt: 15,
		second: 6,
		duration: 3
	}, {
		name: '右转弯通过路口',
		playAt: 18,
		second: 6
	}, {
		name: '超车',
		playAt: 21,
		second: 10
	}, {
		name: '路边临时停车',
		playAt: 24,
		second: 6
	}, {
		name: '会车',
		playAt: 27,
		second: 6
	}, {
		name: '通过桥梁、急弯、坡道行驶',
		playAt: 30,
		second: 6,
		duration: 5
	}];

	var test1 = [
		{ id: 0, value: [1] },
		{ id: 1, value: [2, 2] },
		{ id: 2, value: [] },
		{ id: 3, value: [2] },
		{ id: 4, value: [2, 32] },
		{ id: 5, value: [64, 16] },
		{ id: 6, value: [64, 32, 2, 2, 64, 16, 64] },
		{ id: 7, value: [4, 8] },
		{ id: 8, value: [8, 1] },
		{ id: 9, value: [2, 2] }
	];

	var test2 = [
		{ id: 0, value: [1] },
		{ id: 2, value: [] },
		{ id: 1, value: [2, 2] },
		{ id: 3, value: [2] },
		{ id: 6, value: [2, 32, 2, 2, 64, 16, 64] },
		{ id: 4, value: [32] },
		{ id: 5, value: [64, 16] },
		{ id: 7, value: [64, 4, 8] },
		{ id: 9, value: [8, 1, 2, 2] },
		{ id: 8, value: [] }
	];

	var test3 = [
		{ id: 0, value: [1] },
		{ id: 9, value: [2, 2] },
		{ id: 8, value: [] },
		{ id: 7, value: [4, 8] },
		{ id: 6, value: [8, 1, 32, 2, 2, 64, 16, 64] },
		{ id: 5, value: [16] },
		{ id: 4, value: [64, 32] },
		{ id: 3, value: [64, 2] },
		{ id: 2, value: [2] },
		{ id: 1, value: [2, 2] }
	];

	var test4 = [
		{ id: 0, value: [1] },
		{ id: 7, value: [4, 8] },
		{ id: 3, value: [8, 1, 2] },
		{ id: 6, value: [2, 32, 2, 2, 64, 16, 64] },
		{ id: 1, value: [2, 2] },
		{ id: 8, value: [] },
		{ id: 2, value: [] },
		{ id: 9, value: [2, 2] },
		{ id: 5, value: [16] },
		{ id: 4, value: [64, 32] }
	];

	var test5 = [
		{ id: 0, value: [1] },
		{ id: 5, value: [16] },
		{ id: 9, value: [64, 2, 2] },
		{ id: 7, value: [4, 8] },
		{ id: 3, value: [8, 1, 2] },
		{ id: 6, value: [2, 32, 2, 2, 64, 16, 64] },
		{ id: 8, value: [] },
		{ id: 1, value: [2, 2] },
		{ id: 4, value: [32] },
		{ id: 2, value: [64] }
	];

	var actionTest = [ test1.slice(0), test2.slice(0), test3.slice(0), test4.slice(0), test5.slice(0) ];

	/*
	for (var k = 0, m = actionTest.length; k < m; k++) {
		console.log('test', (k + 1), '======================');
		for (var i = 0, l = actionTest[k].length; i < l; i++) {
			console.log(lightAction[actionTest[k][i].id].name);
		}
	}
	*/

	var LightExamModel = Backbone.Model.extend({

		initialize: function(){

		},

		select: function(id){
			var length = actionTest.length;
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
			if (id === undefined) {
				id = Math.floor(Math.random() * length);
			}
			this.examID = Math.max(Math.min(id, length - 1), 0);
			this.examList = actionTest.slice(this.examID, this.examID + 1)[0];
			this.examNext = 0;
			return this;
		},

		start: function(){
			/*
			console.log('Exam ID:', this.examID, '===========');
			for (var i = 0, l = this.examList.length; i < l; i++) {
				console.log(lightAction[this.examList[i].id].name);
			}
			*/
			this.result = [];
			this.workflow();
		},

		practice: function(){
			var next = this.examList[this.examNext++];
			if (!next) {
				this.finish();
				return;
			}
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
			var action = lightAction[next.id];
			var data = {
				name: action.name,
				playAt: action.playAt,
				second: action.second,
				duration: action.duration
			}
			this.trigger('next', data);
			this.timer = setTimeout(function(){
				this.practice();
			}.bind(this), data.second * 1000);
		},

		workflow: function(){
			var next = this.examList[this.examNext++];
			if (!next) {
				this.finish();
				return;
			}
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
			var action = lightAction[next.id];
			var data = {
				name: action.name,
				playAt: action.playAt,
				second: action.second,
				duration: action.duration
			}
			var expect = 0, result = next.value;
			for (var i = 0, l = result.length; i < l; i++) {
				expect += result[i];
			}
			this.expectResult = expect;
			this.trigger('next', data);
			this.result = [];

			this.timer = setTimeout(function(){
				if (this.check(true)) {
					this.workflow();
				} else {
					if (this.timer) {
						clearTimeout(this.timer);
						this.timer = null;
					}
					this.trigger('fail');
				}
			}.bind(this), data.second * 1000);
		},

		finish: function(){
			this.trigger('finish');
		},

		answer: function(key){
			this.result = this.result || [];
			if (lightMap[key]) {
				this.result.push(lightMap[key]);
				this.check();
				// console.log(this.result)
			}
		},

		check: function(timeout){
			var rst = 0;
			for (var i = 0, l = this.result.length; i < l; i++) {
				rst += this.result[i];
			}
			// 强制检查
			if (timeout) {
				return rst == this.expectResult;
			} else if (this.timer) {
				if (rst == this.expectResult) {
					clearTimeout(this.timer);
					this.timer = null;
					setTimeout(function(){
						this.workflow();
					}.bind(this), 1500);
				}
			}
		}

	});


	window.LightMap = lightMap;
	window.LightExamModel = LightExamModel;

})(window);

