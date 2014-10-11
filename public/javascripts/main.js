var id = window.location.hash.substr(1);
var socket = io.connect('http://10.5.16.17');
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
        { id: 0, value: [1], answer: '开启近光灯'},
        { id: 1, value: [2, 2], answer: '交替使用远近光灯'},
        { id: 2, value: [], answer: '近光灯'},
        { id: 3, value: [2], answer: '远光灯'},
        { id: 4, value: [2, 32], answer: '近光灯，左转向灯'},
        { id: 5, value: [64, 16], answer: '近光灯，右转向灯'},
        { id: 6, value: [64, 32, 2, 2, 64, 16, 64], answer: '先向左打方向灯，再交替使用远近光灯，再向右打方向灯，最后将方向灯回归原位'},
        { id: 7, value: [4, 8], answer: '打开示宽灯，并开启危险报警闪光灯' },
        { id: 8, value: [8, 1], answer: '近光灯'},
        { id: 9, value: [2, 2], answer: '交替使用远近光灯'}
    ],
    [
        { id: 0, value: [1], answer: '开启近光灯' },
        { id: 2, value: [], answer: '近光灯' },
        { id: 1, value: [2, 2], answer: '交替使用远近光灯'},
        { id: 3, value: [2], answer: '远光灯'},
        { id: 6, value: [2, 32, 2, 2, 64, 16, 64], answer: '先向左打方向灯，再交替使用远近光灯，再向右打方向灯，最后将方向灯回归原位'},
        { id: 4, value: [32], answer: '近光灯，左转向灯' },
        { id: 5, value: [64, 16], answer: '近光灯，右转向灯'},
        { id: 7, value: [64, 4, 8], answer: '打开示宽灯，并开启危险报警闪光灯' },
        { id: 9, value: [8, 1, 2, 2], answer: '交替使用远近光灯' },
        { id: 8, value: [], answer: '近光灯' }
    ],
    [
        { id: 0, value: [1], answer: '开启近光灯' },
        { id: 9, value: [2, 2], answer: '交替使用远近光灯' },
        { id: 8, value: [], answer: '近光灯' },
        { id: 7, value: [4, 8], answer: '打开示宽灯，并开启危险报警闪光灯' },
        { id: 6, value: [8, 1, 32, 2, 2, 64, 16, 64], answer: '先向左打方向灯，再交替使用远近光灯，再向右打方向灯，最后将方向灯回归原位' },
        { id: 5, value: [16], answer: '近关灯，右转向灯' },
        { id: 4, value: [64, 32], answer: '近光灯，左转向灯' },
        { id: 3, value: [64, 2], answer: '远光灯' },
        { id: 2, value: [2], answer: '近光灯' },
        { id: 1, value: [2, 2], answer: '交替使用远近光灯'}
    ],
    [
        { id: 0, value: [1], answer: '开启近光灯' },
        { id: 7, value: [4, 8], answer: '打开示宽灯，并开启危险报警闪光灯' },
        { id: 3, value: [8, 1, 2], answer: '远光灯' },
        { id: 6, value: [2, 32, 2, 2, 64, 16, 64], answer: '先向左打方向灯，再交替使用远近光灯，再向右打方向灯，最后将方向灯回归原位'},
        { id: 1, value: [2, 2], answer: '交替使用远近光灯' },
        { id: 8, value: [], answer: '近光灯'},
        { id: 2, value: [], answer: '近光灯'},
        { id: 9, value: [2, 2], answer: '交替使用远近光灯'},
        { id: 5, value: [16], answer: '近关灯，右转向灯'},
        { id: 4, value: [64, 32], answer: '近光灯，左转向灯' }
    ],
    [
        { id: 0, value: [1], answer: '开启近光灯'},
        { id: 5, value: [16], answer: '近关灯，右转向灯'},
        { id: 9, value: [64, 2, 2], answer: '交替使用远近光灯'},
        { id: 7, value: [4, 8], answer: '打开示宽灯，并开启危险报警闪光灯'},
        { id: 3, value: [8, 1, 2], answer: '远光灯'},
        { id: 6, value: [2, 32, 2, 2, 64, 16, 64], answer: '先向左打方向灯，再交替使用远近光灯，再向右打方向灯，最后将方向灯回归原位'},
        { id: 8, value: [], answer: '近光灯'},
        { id: 1, value: [2, 2], answer: '交替使用远近光灯' },
        { id: 4, value: [32], answer: '近光灯，左转向灯' },
        { id: 2, value: [64], answer: '近光灯'}
    ]
];
var Exam = {
    freedom: true,
    initialize: function () {
        var model = this;
        this.on('next', this.next);
        this.on('success', function () {
            this.voice.play('e')
        }, this);
        this.on('question', function (question, vid) {
            this.voice.play(vid);
            //alert(question.answer);
            setTimeout(function () {
                if (model.check()) {
                    model.next();
                } else {
                    model.fail();
                }
            }, question.timeout * 1e3);
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
        //event  examstart
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
        var question = this.actions[current];
        question = _.extend({}, question, paper[step]);
        // event question e.name e.vid
        this.trigger('question', question, "v" + current);
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
        //event success
        this.trigger('success');
        this.socket.emit('success', {id: this.id})
    },
    //考试
    fail: function () {
        var paper = this.papers[this.index];
        var step = this.step;
        var current = paper[step].id;
        var question = this.actions[current];
        question = _.extend({}, question, paper[step]);
        this.trigger('fail', question);
        this.socket.emit('fail', { question: question, id: this.id });
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
socket.on('connect success', function () {
    //Exam.load(_.random(0, 4)).start();
});
socket.on('signed', function () {
    alert('该宝马是别人的啦！！');
});

$('.page2 .btn').click(function (e) {
    Exam.operation(this.dataset.value);
});
Exam.on('examstart', function () {
    noty({
        text: '开始考试',
        type: 'success',
        dismissQueue: true,
        layout: 'bottomRight',
        theme: 'defaultTheme',
        maxVisible: 10,
        timeout: 1000
    });
});
Exam.on('question', function (question) {
    if (Exam.freedom) {
        noty({
            text: question.answer,
            type: 'information',
            dismissQueue: true,
            layout: 'bottomRight',
            theme: 'defaultTheme',
            maxVisible: 10,
            timeout: question.timeout * 1000 - 200
        });
    }

});
Exam.on('fail', function (question) {
    noty({
        text: question.name + ' 操作错误!!',
        type: 'error',
        dismissQueue: true,
        layout: 'bottomRight',
        theme: 'defaultTheme',
        maxVisible: 10
    });
});
$('#btn-1').click(function () {
    $('.page2').css({top: 0});
    Exam.load(_.random(0, 4)).start();
});


