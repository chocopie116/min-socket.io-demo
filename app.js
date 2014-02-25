var app = require('http').createServer(handler)
, io = require('socket.io').listen(app)
, fs = require('fs')

app.listen(process.env.PORT || 3000);

var number = 0;

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
            function (err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error loading index.html');
                }

                res.writeHead(200);
                res.end(data);
            });
}

io.set('log level', 1);
io.sockets.on('connection', function (socket) {
    //接続段階で現在の状態を通知
    io.sockets.emit('all_click', number);

    //クライアントからの通知を待ち受けている
    socket.on('from_client', function () {
        number++;
        io.sockets.emit('all_clicks', number); //全員に送信
        socket.emit('your_click', 1); //自分(クリックした人)のみに送信
        socket.broadcast.emit('other_click', 1); //自分(クリックした人)以外に送信
    });
});
