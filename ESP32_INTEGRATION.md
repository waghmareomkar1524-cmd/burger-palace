# ESP32 Integration Guide for Classic Cafe Order Management

This guide explains how to integrate your ESP32 with the Firebase Realtime Database to manage the order queue.

## Firebase Database Structure

The Firebase database has the following structure:

```
{
  "orders": {
    "orderId": {
      "orderId": "1704110400000",
      "orderNumber": "ORD12345678",
      "tableNumber": "5",
      "items": [
        {
          "name": "Classic Burger",
          "quantity": 2,
          "price": 299
        }
      ],
      "total": 350,
      "status": "pending",
      "timestamp": "2024-01-01T12:00:00.000Z",
      "createdAt": 1704110400000
    }
  },
  "queue": {
    "orderId": {
      "orderNumber": "ORD12345678",
      "tableNumber": "5",
      "timestamp": 1704110400000
    }
  }
}
```

## ESP32 Code Example

Here's a complete ESP32 code example using the Firebase REST API:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Firebase configuration
const char* firebaseHost = "your-project-default-rtdb.firebaseio.com";
const char* firebaseAuth = "YOUR_FIREBASE_AUTH_TOKEN"; // Optional for public database

// Button pin
const int buttonPin = 2;

void setup() {
  Serial.begin(115200);
  
  // Initialize button
  pinMode(buttonPin, INPUT_PULLUP);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Check button press
  if (digitalRead(buttonPin) == LOW) {
    delay(50); // Debounce
    if (digitalRead(buttonPin) == LOW) {
      Serial.println("Button pressed - Processing next order");
      processNextOrder();
      delay(1000); // Prevent multiple triggers
    }
  }
  
  delay(100);
}

void processNextOrder() {
  // Get the first order in queue
  String firstOrder = getFirstOrderInQueue();
  
  if (firstOrder != "") {
    // Parse the order data
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, firstOrder);
    
    String orderNumber = doc["orderNumber"];
    String tableNumber = doc["tableNumber"];
    
    Serial.println("Processing Order:");
    Serial.println("Order Number: " + orderNumber);
    Serial.println("Table Number: " + tableNumber);
    
    // Complete the order (remove from queue and update status)
    completeOrder(orderNumber);
    
    // Display on LCD or Serial
    displayOrderInfo(orderNumber, tableNumber);
  } else {
    Serial.println("No orders in queue");
  }
}

String getFirstOrderInQueue() {
  HTTPClient http;
  String url = "https://" + String(firebaseHost) + "/queue.json?orderBy=\"timestamp\"&limitToFirst=1";
  
  http.begin(url);
  int httpCode = http.GET();
  
  if (httpCode > 0) {
    String payload = http.getString();
    http.end();
    
    // Parse the response
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    
    if (doc.size() > 0) {
      JsonObject firstOrder = doc.as<JsonObject>();
      String orderData = "";
      serializeJson(firstOrder, orderData);
      return orderData;
    }
  }
  
  http.end();
  return "";
}

void completeOrder(String orderNumber) {
  // Find the order ID by order number
  String orderId = findOrderIdByOrderNumber(orderNumber);
  
  if (orderId != "") {
    // Update order status to completed
    updateOrderStatus(orderId, "completed");
    
    // Remove from queue
    removeFromQueue(orderId);
    
    Serial.println("Order " + orderNumber + " completed and removed from queue");
  }
}

String findOrderIdByOrderNumber(String orderNumber) {
  HTTPClient http;
  String url = "https://" + String(firebaseHost) + "/orders.json?orderBy=\"orderNumber\"&equalTo=\"" + orderNumber + "\"";
  
  http.begin(url);
  int httpCode = http.GET();
  
  if (httpCode > 0) {
    String payload = http.getString();
    http.end();
    
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    
    if (doc.size() > 0) {
      JsonObject order = doc.as<JsonObject>();
      return order["orderId"];
    }
  }
  
  http.end();
  return "";
}

void updateOrderStatus(String orderId, String status) {
  HTTPClient http;
  String url = "https://" + String(firebaseHost) + "/orders/" + orderId + "/status.json";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  
  String jsonData = "\"" + status + "\"";
  int httpCode = http.PUT(jsonData);
  
  if (httpCode > 0) {
    Serial.println("Order status updated to: " + status);
  }
  
  http.end();
}

void removeFromQueue(String orderId) {
  HTTPClient http;
  String url = "https://" + String(firebaseHost) + "/queue/" + orderId + ".json";
  
  http.begin(url);
  int httpCode = http.DELETE();
  
  if (httpCode > 0) {
    Serial.println("Order removed from queue");
  }
  
  http.end();
}

void displayOrderInfo(String orderNumber, String tableNumber) {
  // Display order information on LCD or Serial
  Serial.println("=== ORDER COMPLETED ===");
  Serial.println("Order: " + orderNumber);
  Serial.println("Table: " + tableNumber);
  Serial.println("======================");
}
```

## Required Libraries

Install these libraries in Arduino IDE:

1. **WiFi** (built-in)
2. **HTTPClient** (built-in)
3. **ArduinoJson** by Benoit Blanchon

## Firebase Security Rules

Update your Firebase Realtime Database rules:

```json
{
  "rules": {
    "orders": {
      ".read": true,
      ".write": true
    },
    "queue": {
      ".read": true,
      ".write": true
    }
  }
}
```

## ESP32 Pin Configuration

- **Button Pin**: GPIO 2 (with internal pull-up)
- **LED Pin**: GPIO 13 (optional, for status indication)
- **LCD Pins**: Configure as needed for your LCD module

## Testing the Integration

1. Place an order through the web app
2. Check Firebase console to see the order in the queue
3. Press the button on ESP32
4. Verify the order is removed from the queue
5. Check that the order status is updated to "completed"

## Troubleshooting

- Ensure WiFi connection is stable
- Check Firebase database URL is correct
- Verify Firebase security rules allow read/write access
- Monitor Serial output for error messages
- Test with a simple HTTP request first

## Advanced Features

You can extend this integration with:

- **LCD Display**: Show order details on a display
- **Buzzer**: Audio notification for new orders
- **LED Indicators**: Visual status indicators
- **Multiple Buttons**: Different actions for different order statuses
- **Real-time Updates**: Use Firebase WebSocket for real-time order updates
