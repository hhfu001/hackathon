var id = window.location.hash.substr(1);
var socket = io.connect('http://10.5.16.177');
socket.on('news', function (data) {
    socket.emit('device', {id: id});
});
var voice = new Howl({
    src: '/light-action.mp3',
    sprite: {
        s: [0, 2000],
        v0: [3000, 2000],
        v1: [6000, 2000],
        v2: [9000, 2000],
        v3: [12000, 2000],
        v4: [15500, 2000],
        v5: [18000, 2000],
        v6: [21000, 2000],
        v7: [24000, 2000],
        v8: [27000, 2000],
        v9: [30000, 3000],
        e: [35000, 5000]
    }
});
var map = {
    'headlight': 1,	// 近光灯
    'highlight': 2,	// 远光灯
    'widthlamp': 4, // 示宽灯
    'emergency': 8, // 危险报警灯
    'right': 16, 	// 右转灯
    'left': 32,		// 左转灯
    'reset': 64		// 转向恢复原位
};

var actions = [
    {
        name: '开启灯光',
        timeout: 5
    },
    {
        name: '通过人行横道线',
        timeout: 6
    },
    {
        name: '直行通过路口',
        timeout: 6
    },
    {
        name: '照明不良道路行驶',
        timeout: 6
    },
    {
        name: '左转弯通过路口',
        timeout: 6
    },
    {
        name: '右转弯通过路口',
        timeout: 6
    },
    {
        name: '超车',
        timeout: 10
    },
    {
        name: '路边临时停车',
        timeout: 6
    },
    {
        name: '会车',
        timeout: 6
    },
    {
        name: '通过桥梁、急弯、坡道行驶',
        timeout: 6
    }
];
var papers = [
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ]
];
var Exam = {
    initialize: function () {
        var model = this;
        this.on('next', this.next);
        this.on('success', function () {
            this.voice.play('e')
        }, this);
        this.on('action', function (action, vid) {
            this.voice.play(vid);
            setTimeout(function () {
                if (model.check()) {
                    model.next();
                } else {
                    model.fail();
                }
            }, action.timeout * 1e3);
        });
    },
    //载入试卷
    load: function (index) {
        this.index = index || 0;
        return this;
    },
    // 开始考试
    start: function () {
        var model = this;
        this.step = -1;
        this.trigger('examstart', this);
        this.socket.emit('examstart');
        this.voice.play('s');
        setTimeout(function () {
            model.next();
        }, 3000);
        return this;
    },
    //下一步
    next: function () {
        this.step++;
        var paper = this.papers[this.index];
        var step = this.step;
        // 答题完毕
        if (!paper) {
            this.success();
            return this;
        }
        //下一题
        var current = paper[step].id;
        var action = this.actions[current];
        var vid = "v" + current;
        this.trigger('action', action, vid);
        this.answer = [];
        return this;
    },
    //操作 相应点击操作
    operation: function (key) {
        this.socket.emit('action', {id: this.id, action: key});
        this.answer = this.answer || [];
        this.answer.push(this.map[key]);
        return this;
    },
    //核对答案
    check: function () {
        var paper = this.papers[this.index];
        var step = this.step;
        var rightAnswer = paper[step].value;
        var answer = this.answer;
        return _.isEqual(rightAnswer, answer);
    },
    //考试通过
    success: function () {
        this.trigger('success');
        this.socket.emit('success', {id: this.id})
    },
    //考试
    fail: function () {
        var paper = this.papers[this.index];
        var step = this.step;
        var current = paper[step].id;
        var action = this.actions[current];
        this.trigger('fail', action);
        this.socket.emit('fail', {
            action: action,
            id: this.id
        });
    }
};
_.extend(Exam, Backbone.Events, {
    socket: socket,
    voice: voice,
    actions: actions,
    map: map,
    papers: papers,
    id: id
});
Exam.initialize();
Exam.on('fail', function (action) {
    alert(action.name);
});
socket.on('connect success', function () {
    //Exam.load(_.random(0, 4)).start();
});
socket.on('signed', function () {
    alert('该宝马是别人的啦！！');
});

$('.page2 .btn').click(function (e) {
    Exam.operation(this.dataset.value);
});


$('#btn-1').click(function(){
    $('.page2').css({top: 0});
    Exam.load(_.random(0, 4)).start();
});


