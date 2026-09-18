/*
  Solvy Focus Buddy — ESP32 starter firmware

  USB serial protocol:
    Browser -> device: START / STUCK / DONE / TASK:<text>
    Device -> browser: START / STUCK / DONE / BUTTON:<name>

  Hardware suggested by the concept:
    ESP32
    0.96" I2C OLED (SSD1306)
    Rotary encoder (optional)
    3 push buttons: START, STUCK, DONE
    Buzzer + status LED (optional)

  Install libraries:
    Adafruit SSD1306
    Adafruit GFX

  Set the pins below to match your wiring.
*/

#include <Arduino.h>

const int START_PIN = 25;
const int STUCK_PIN = 26;
const int DONE_PIN  = 27;
const int LED_PIN   = 2;
const int BUZZER_PIN = 14;

void beep(int ms = 60) {
  digitalWrite(BUZZER_PIN, HIGH);
  delay(ms);
  digitalWrite(BUZZER_PIN, LOW);
}

void emit(const char* eventName) {
  Serial.println(eventName);
  digitalWrite(LED_PIN, HIGH);
  beep();
  delay(80);
  digitalWrite(LED_PIN, LOW);
}

void setup() {
  pinMode(START_PIN, INPUT_PULLUP);
  pinMode(STUCK_PIN, INPUT_PULLUP);
  pinMode(DONE_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.begin(115200);
  delay(500);
  Serial.println("READY");
}

void handleCommand(String command) {
  command.trim();
  if (command == "START") emit("START");
  else if (command == "STUCK") emit("STUCK");
  else if (command == "DONE") emit("DONE");
  else if (command.startsWith("TASK:")) {
    Serial.print("TASK_SET:");
    Serial.println(command.substring(5));
  }
}

void loop() {
  static bool lastStart = HIGH, lastStuck = HIGH, lastDone = HIGH;
  bool startNow = digitalRead(START_PIN);
  bool stuckNow = digitalRead(STUCK_PIN);
  bool doneNow = digitalRead(DONE_PIN);

  if (lastStart == HIGH && startNow == LOW) emit("BUTTON:START");
  if (lastStuck == HIGH && stuckNow == LOW) emit("BUTTON:STUCK");
  if (lastDone == HIGH && doneNow == LOW) emit("BUTTON:DONE");

  lastStart = startNow;
  lastStuck = stuckNow;
  lastDone = doneNow;

  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    handleCommand(command);
  }

  delay(20);
}
