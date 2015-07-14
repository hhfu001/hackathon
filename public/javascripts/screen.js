var href = 'http://192.168.1.110:3000/control.html';
var socket = io.connect('http://192.168.1.110');
socket.on('news', function () {
    socket.emit('screen');
});
socket.on('usable', function (data) {
    $('.qrcode')
        .empty()
        .qrcode(href + '#' + data.id).show();
	    console.log(href + '#' + data.id);
});

socket.on('connect success', function () {
	// console.log('connect success');
    $('.qrcode').hide();
	Lights.clean();
});

socket.on('action', function (data) {
	//console.log(data);
    Lights[data]();
});