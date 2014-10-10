var href = 'http://10.5.16.17:3000/control.html';
var socket = io.connect('http://10.5.16.17');
socket.on('news', function (data) {
    $('.qrcode').qrcode(href + '#' + data.id);
    console.log(href + '#' + data.id)
});
socket.on('device connect', function () {
    $('.qrcode').hide();
});
socket.on('action', function (data) {
    console.log(data);
});