var isFlashAir = false;

var urlBase = 'http://obakahack123'; //TODO debug

var appUrl = urlBase + '/app';
var cgiUrl = urlBase + "/command.cgi?op=131&ADDR=0&LEN=3&DATA=";

/**
 * FlashAirに対してHTTP通信 GETをする
 * @param param
 */
function flashair_get(param) {
    var request = new XMLHttpRequest();
    request.open("GET", param, false);
    request.send(null);
    //通信結果
    //console.log(request.responseText);
}

/**
 * 共有メモリを初期化
 */
function flashair_memory_init() {
    //socket.emit('sendmsg', '0');
    var url = cgiUrl + 0;
    flashair_get(url);
}

/**
 * 共有メモリに書き込み
 * @param argByte
 */
function write_memory(argByte) {
    var url = cgiUrl + argByte;
    flashair_get(url);
}

$(document).ready(function () {

    //シリアル通信用処理
    //var socket = io();
    $('.ioBtn').click(function(){
        var val = $(this).val();
        console.log("btn " + val + " clicked...");
        //socket.emit('sendmsg', val.toString());
        write_memory(val);
    });
    //socket.emit('sendmsg', '0');
});
