var mraa = require("mraa");
var io = require('socket.io-client');
var servo = new mraa.Pwm(3);//Pin 3
var led = new mraa.Gpio(8);
led.dir(mraa.DIR_OUT);

servo.enable(true);
servo.period_us(19000000) //PWM Period https://www.arduino.cc/en/Tutorial/SecretsOfArduinoPWM
servo.write(1);

var socket = io('http://localhost:3000');
  socket.on('connect', function () {
    socket.emit("message", 'send message.');
});

setTimeout(function(){
	servo.write(0);
	led.write(1);
},1000)

setTimeout(function(){
	servo.write(0.5);
	led.write(0);
},2000)
