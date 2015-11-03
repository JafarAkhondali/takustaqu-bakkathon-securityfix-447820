var mraa = require("mraa");
var servo = new mraa.Pwm(3);//Pin 3

servo.enable(true);
servo.period_us(19000000) //PWM Period https://www.arduino.cc/en/Tutorial/SecretsOfArduinoPWM
servo.write(1);

setTimeout(function(){
	servo.write(0);
},1000)

setTimeout(function(){
	servo.write(0.5);
},2000)
