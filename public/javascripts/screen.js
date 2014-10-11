var href = 'http://10.5.16.177:3000/control.html';
var socket = io.connect('http://10.5.16.177');
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
    $('.qrcode').hide();
});
socket.on('action', function (data) {
    Lights[data]();
});