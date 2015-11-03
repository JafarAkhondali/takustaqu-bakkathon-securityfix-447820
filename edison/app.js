var mraa = require("mraa");
var io = require('socket.io-client');
var servo = new mraa.Pwm(3);//Pin 3
var led = new mraa.Gpio(8);
led.dir(mraa.DIR_OUT);

var shockPin = new mraa.Gpio(5);
shockPin.dir(mraa.DIR_OUT);


servo.enable(true);
servo.period_us(19000000) //PWM Period https://www.arduino.cc/en/Tutorial/SecretsOfArduinoPWM
servo.write(1);

var socket = io('http://bakathon.cloudapp.net/');
  socket.on('doflip', function () {
    console.log("foo");
    //servo.write(0);
	led.write(1);
	shockPin.write(1);
	setTimeout(function(){
		//servo.write(0.5);
		led.write(0);
		shockPin.write(0);
	},1000)
	setTimeout(function(){
		//servo.write(1);
	},2000)

});
