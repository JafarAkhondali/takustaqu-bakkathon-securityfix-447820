//for Flash Air
#include <iSdio.h>
#include <utility/Sd2CardExt.h>
#include <Adafruit_NeoPixel.h>
#include <avr/power.h>
//for Servo
#include <Servo.h>
#include <avr/wdt.h>

//for FlashAir
#define VOLPIN 1
#define NEOPIXEL_PIN 9
//#define PIXEL_NUM 32
#define PIXEL_NUM 9
Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXEL_NUM, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);
const int chipSelectPin = 4;
Sd2CardExt card;
uint8_t buffer[512];

//for NeoPixel
int currentByte = 0;
int LED_R = 0;
int LED_G = 0;
int LED_B = 0;

//for Servo
Servo sv;
#define SERVO_PIN 11

//for button
const int buttonPin = 13;     // the number of the pushbutton pin
int buttonState = 0;         // variable for reading the pushbutton status


int isDebug = 0; //1=FlashAirなし。色の確認 0=FlashAirあり
int isServoDone = 0; //サーボが起動したかどうか？

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ;
  }
  MCUSR = 0;  // for Reset : clear out any flags of prior resets.

/*
  if(!isDebug){//TODO Servo bug fix....
    // Initialize SD card.
    Serial.print(F("\nInitializing SD card..."));
    if (card.init(SPI_HALF_SPEED, chipSelectPin)) {
      //Serial.print(F("OK"));
    } else {
      //Serial.print(F("NG"));
      abort();
    }
    memset(buffer, 0, 0x200);
  }
  */


  //For Neopixel
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'

  sv.attach(SERVO_PIN, 800, 2300);// For Servo

  pinMode(buttonPin, INPUT);// for BUtton
}



void loop() {

  float vol_value = analogRead(VOLPIN);
  char str[5];
  int val;


  if(isDebug == 0 && isServoDone == 0){

        //for button
        buttonState = digitalRead(buttonPin);
        if (buttonState == HIGH) {
              //ボタンが押されたらサーボ起動、移動後にFlahsAirの初期化 (TODO 先に初期化するとサーボが動かないバグのため暫定)
              Serial.println("Btn High!!!!yeah");
              //時計周りに 0 度の方向へ、そして戻した後に、FAを起動
             moveServoShaft(0, 1);
             moveServoShaft(90, 1);
             delay(1000);
             isDebug = 1;
             // Initialize SD card.
             Serial.print(F("\nInitializing SD card..."));
               if (card.init(SPI_HALF_SPEED, chipSelectPin)) {
                 Serial.print(F("OK"));
               } else {
                 Serial.print(F("NG"));
                 abort();
               }
             memset(buffer, 0, 0x200);
          }else {
            //nothing
        }

        int d = Serial.read();
        if( d == 'a' ){
          sv.attach(SERVO_PIN);
        }
        else if( d == 'd' ){
          sv.detach();
        }
        else if( d == 'r' ){
          Serial.println(sv.read());
          Serial.println(sv.readMicroseconds());
        }
        else if( '0' <= d && d <= '9' ){
              //時計周りに 0 度の方向へそして戻してFA移動
             moveServoShaft(0, 10);
             moveServoShaft(90, 10);
             delay(1000);

             //サーボ終了
             isServoDone = 1;

             // Initialize SD card.
             Serial.print(F("\nInitializing SD card..."));
               if (card.init(SPI_HALF_SPEED, chipSelectPin)) {
                 Serial.print(F("OK"));
               } else {
                 Serial.print(F("NG"));
                 abort();
               }
             memset(buffer, 0, 0x200);

        }
      //}
  }else{

    if (card.readExtMemory(1, 1, 0x1000, 0x200, buffer)) {

      str[0] = buffer[0];
      str[1] = buffer[1];
      str[2] = buffer[2];
      str[3] = buffer[3];
      str[4] = 0;
      val = atoi(str);

        //0バイトの場合初期化
        if(currentByte != 0 && val == 0){
            strip.clear();
            strip.show();
            Serial.println("back to start");
            currentByte = 0;
        }

        if(val == 0 || val == currentByte){
          //do nothing...
          //Serial.println("get 1...");
        }else{

          if (vol_value < 800){
            //Serial.println("byte changed...");
            currentByte = val;
            showLed3AndHelloServo(val);
            Serial.println(val);
          }else{
            strip.clear();
            strip.show();
          }
        }
      }
  }
  delay(450);
}


void showLed3AndHelloServo(int val){

      Serial.println("led array was....");
      Serial.println(val);
      Serial.println("ooooooooooooooooooo");

      //strip.clear();
      switch(val){
        case 123://how
          colorWipe(strip.Color(255, 255, 255), 100); // white
          colorWipe(strip.Color(0, 0, 0), 100); // black
                    colorWipe(strip.Color(255, 255, 255), 100); // white
                    colorWipe(strip.Color(0, 0, 0), 100); // black
                              colorWipe(strip.Color(255, 255, 255), 100); // white
                              colorWipe(strip.Color(0, 0, 0), 100); // black

          //TODO Arduinoをリセット
          wdt_enable(WDTO_15MS); // turn on the WatchDog and don't stroke it.
          for(;;) {
            // do nothing and wait for the eventual...
          }

          break;
        case 1://サーボ準備
          sv.attach(SERVO_PIN);
          Serial.println("servo attached...");//サーボの位置確認
          break;
        case 2://サーボ回転
          Serial.println(sv.read());//サーボの位置確認
          moveServoShaft(0, 10);
          //delay(100);//TODO 不要
          delay(1000);
          break;
        case 3://サーボ戻す
          Serial.println(sv.read());//サーボの位置確認
          moveServoShaft(90, 10);
          //delay(100);//TODO 不要
          delay(1000);
          break;
        case 4://サーボ終了
          sv.detach();
          break;
        case 0://クリア
          strip.clear();
          break;
        case 555://白
        case 5://白
          colorWipe(strip.Color(255, 255, 255), 80); // white
          delay(3000);
          colorWipe(strip.Color(0, 0, 0), 100); // black

          break;
        case 666://紫
        case 6://紫
            colorWipe(strip.Color(105, 14, 102), 80); // purple
            delay(3000);
            colorWipe(strip.Color(0, 0, 0), 100); // black
          break;
        case 777://ピンク
        case 7://ピンク
          colorWipe(strip.Color(252, 18, 245), 80); // pink
          delay(3000);
          colorWipe(strip.Color(0, 0, 0), 100); // black
          break;
        case 888://レインボー？
        case 8://レインボー？
          rainbow(20);
          //rainbowCycle(80);
          break;
        case 999://黒 = 消す
        case 9://黒 = 消す
          colorWipe(strip.Color(0, 0, 0), 10); // black
          strip.clear();
          break;
        case 100://予備
          break;
        default:
          Serial.println("this is for servo");
          colorWipe(strip.Color(0, 0, 0), 10); // black
          strip.clear();
          break;
      }
}







//NEOPIXEL LIBRARRY
// Fill the dots one after the other with a color
void colorWipe(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, c);
      strip.show();
      delay(wait);
  }
}

void rainbow(uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256; j++) {
    for(i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel((i+j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

// Slightly different, this makes the rainbow equally distributed throughout
void rainbowCycle(uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256*5; j++) { // 5 cycles of all colors on wheel
    for(i=0; i< strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

//Theatre-style crawling lights.
void theaterChase(uint32_t c, uint8_t wait) {
  for (int j=0; j<10; j++) {  //do 10 cycles of chasing
    for (int q=0; q < 3; q++) {
      for (int i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, c);    //turn every third pixel on
      }
      strip.show();

      delay(wait);

      for (int i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, 0);        //turn every third pixel off
      }
    }
  }
}

//Theatre-style crawling lights with rainbow effect
void theaterChaseRainbow(uint8_t wait) {
  for (int j=0; j < 256; j++) {     // cycle all 256 colors in the wheel
    for (int q=0; q < 3; q++) {
        for (int i=0; i < strip.numPixels(); i=i+3) {
          strip.setPixelColor(i+q, Wheel( (i+j) % 255));    //turn every third pixel on
        }
        strip.show();

        delay(wait);

        for (int i=0; i < strip.numPixels(); i=i+3) {
          strip.setPixelColor(i+q, 0);        //turn every third pixel off
        }
    }
  }
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
   return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  } else if(WheelPos < 170) {
    WheelPos -= 85;
   return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  } else {
   WheelPos -= 170;
   return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
  }
}

void printByte(uint8_t value) {
  Serial.print(value >> 4, HEX);
  Serial.print(value & 0xF, HEX);
}

void printBytes(uint8_t* p, uint32_t len) {
  for (int i = 0; i < len; ++i) {
    printByte(p[i]);
  }
}


//For Servo
void moveServoShaft(int angle, long int delay_ms)
{
  int pulse = map(angle, 0, 180, 800, 2300);
  int pulse_now = sv.readMicroseconds();

  if( pulse > pulse_now ){
    for( int i = pulse_now; i <= pulse; i++ ){
      sv.writeMicroseconds(i);
      delay(delay_ms);
    }
  }
  else if( pulse < pulse_now ){
    for( int i = pulse_now; i >= pulse; i-- ){
      sv.writeMicroseconds(i);
      delay(delay_ms);
    }
  }
  else{
    // do nothing
  }
}