# Mobile App — SL Police Traffic Fine Payment

Flutter Android app for traffic officers to process on-the-spot fine payments at the roadside.

## Prerequisites

- Flutter SDK (3.x or later)
- Android phone or emulator
- Backend running on the same WiFi network

## Configure the backend URL

Edit [lib/config.dart](lib/config.dart) and set your computer's local IP:

```dart
static const String apiBaseUrl = 'http://192.168.1.5:8080';
```

Run `ipconfig` (Windows) to find your computer's local IP on the network.

## Setup

```bash
cd mobile-app
flutter pub get
```

## Run

Connect an Android phone via USB (USB debugging enabled) or start an emulator:

```bash
flutter run
```

To target a specific device:

```bash
flutter devices          # list available devices
flutter run -d <device-id>
```

## Build APK (for manual installation)

```bash
flutter build apk --release
```

Output: `build/app/outputs/flutter-apk/app-release.apk`

## App Flow

1. **Lookup screen** — enter fine reference number and category code
2. **Fine details screen** — view fine info; if unpaid, select payment method and confirm
3. **Confirmation screen** — transaction reference and success message; SMS sent to issuing officer

## Notes

- `android:usesCleartextTraffic="true"` in AndroidManifest allows `http://` on Android 9+.
- No authentication — uses the same public endpoints as the web payment portal.
