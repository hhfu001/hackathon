var href = 'http://10.5.16.17:3000/control.html';
var socket = io.connect('http://10.5.16.17');
socket.on('news', function () {
    socket.emit('screen');
});
socket.on('usable', function (data) {
    $('.qrcode')
        .empty()
        .qrcode(href + '#' + data.id).show();
});
socket.on('connect success', function () {
    $('.qrcode').hide();
});
socket.on('action', function (data) {
    Lights[data]();
});